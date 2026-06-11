// Generates the destination poster art in public/art/*.svg.
// Run with: node scripts/generate-art.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const W = 1200;
const H = 900;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "art");

function seeded(slug) {
  let h = 2166136261;
  for (const c of slug) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822519);
    h = Math.imul(h ^ (h >>> 13), 3266489917);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const grain = `
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0"/>
  </filter>`;

function doc(defs, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>${defs}${grain}</defs>
${body}
<rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;
}

function skyGrad(id, top, bottom) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
  </linearGradient>`;
}

function wavePath(yBase, amp, phase, rnd) {
  const pts = [];
  for (let x = 0; x <= W; x += 100) {
    pts.push(`${x},${(yBase + Math.sin(x / 160 + phase) * amp + (rnd() - 0.5) * amp * 0.4).toFixed(1)}`);
  }
  return `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
}

function range(yBase, amp, n, rnd) {
  const pts = [`0,${yBase + (rnd() - 0.5) * amp}`];
  for (let i = 1; i <= n; i++) {
    const x = (W / n) * i;
    const y = yBase - rnd() * amp + (i % 2 ? -amp * 0.5 : amp * 0.3) * rnd();
    pts.push(`${x.toFixed(0)},${y.toFixed(1)}`);
  }
  return `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
}

function hill(yBase, amp, phase) {
  let d = `M0,${yBase}`;
  for (let x = 0; x <= W; x += 300) {
    const y1 = yBase - Math.sin((x + 150) / 280 + phase) * amp;
    d += ` Q${x + 150},${y1.toFixed(1)} ${x + 300},${yBase - Math.sin((x + 300) / 380 + phase) * amp * 0.5}`;
  }
  return `${d} L${W},${H} L0,${H} Z`;
}

function sun(cx, cy, r, color, opacity = 1) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
}

function seaBands(yStart, colors, rnd) {
  const bandH = (H - yStart) / colors.length;
  return colors
    .map((c, i) => {
      const y = yStart + i * bandH;
      return `<path d="${wavePath(y, 8 + i * 4, i * 1.7, rnd)}" fill="${c}"/>`;
    })
    .join("\n");
}

function skyline(yBase, color, rnd, spire = false) {
  let x = -20;
  let rects = "";
  while (x < W) {
    const w = 50 + rnd() * 110;
    const h = 60 + rnd() * 220;
    rects += `<rect x="${x.toFixed(0)}" y="${(yBase - h).toFixed(0)}" width="${w.toFixed(0)}" height="${(h + 10).toFixed(0)}" fill="${color}"/>`;
    x += w + rnd() * 30;
  }
  if (spire) {
    rects += `<polygon points="${W / 2 - 70},${yBase} ${W / 2},${yBase - 420} ${W / 2 + 70},${yBase}" fill="${color}"/>
      <rect x="${W / 2 - 4}" y="${yBase - 470}" width="8" height="60" fill="${color}"/>`;
  }
  return rects + `<rect x="0" y="${yBase}" width="${W}" height="${H - yBase}" fill="${color}"/>`;
}

function acacia(cx, yBase, color) {
  return `
  <path d="M${cx},${yBase} C${cx - 8},${yBase - 90} ${cx - 20},${yBase - 130} ${cx - 45},${yBase - 165}" stroke="${color}" stroke-width="9" fill="none"/>
  <path d="M${cx},${yBase - 60} C${cx + 15},${yBase - 110} ${cx + 30},${yBase - 135} ${cx + 55},${yBase - 158}" stroke="${color}" stroke-width="7" fill="none"/>
  <ellipse cx="${cx}" cy="${yBase - 175}" rx="130" ry="26" fill="${color}"/>`;
}

function palm(cx, yBase, color) {
  const leaves = [
    [-95, -52], [-65, -85], [-15, -100], [40, -92], [85, -60],
  ]
    .map(
      ([dx, dy]) =>
        `<path d="M${cx},${yBase - 130} Q${cx + dx * 0.7},${yBase - 130 + dy} ${cx + dx},${yBase - 130 + dy + 26}" stroke="${color}" stroke-width="10" stroke-linecap="round" fill="none"/>`,
    )
    .join("");
  return `<path d="M${cx - 12},${yBase} C${cx - 6},${yBase - 60} ${cx + 2},${yBase - 95} ${cx + 4},${yBase - 128}" stroke="${color}" stroke-width="13" stroke-linecap="round" fill="none"/>${leaves}`;
}

function vineRows(yStart, color) {
  let rows = "";
  for (let i = 0; i < 9; i++) {
    const y = yStart + i * ((H - yStart) / 9);
    const spread = 40 + i * 26;
    rows += `<path d="M${W / 2 - spread * 6},${H} Q${W / 2},${y - 16} ${W / 2 + spread * 6},${H}" stroke="${color}" stroke-width="${3 + i * 0.7}" fill="none" opacity="0.5"/>`;
  }
  return rows;
}

function aurora(color) {
  return `<path d="M-50,300 C250,180 420,330 700,210 C900,125 1100,220 1250,140 L1250,40 C1050,120 880,40 660,130 C420,230 260,90 -50,200 Z" fill="${color}" opacity="0.45"/>
  <path d="M-50,360 C300,260 500,380 780,280 C980,210 1140,290 1250,230 L1250,190 C1080,250 920,170 700,250 C460,340 280,200 -50,300 Z" fill="${color}" opacity="0.25"/>`;
}

const scenes = {
  maldives(rnd) {
    return doc(
      skyGrad("sky", "#f6e8d4", "#bfe3dd"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(880, 270, 95, "#eec98f")}
      ${seaBands(430, ["#8fd0c6", "#5db4ad", "#2f8f8c", "#1f6f70"], rnd)}
      ${palm(220, 470, "#1b4f4d")}`,
    );
  },
  santorini(rnd) {
    return doc(
      skyGrad("sky", "#f3ede1", "#b9cfdd"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(300, 230, 75, "#f0d9a8")}
      <path d="${range(450, 150, 6, rnd)}" fill="#dfe6ea"/>
      <path d="${range(540, 130, 5, rnd)}" fill="#a9bfcd"/>
      ${seaBands(640, ["#5e8fae", "#3f6f93", "#2c5478"], rnd)}
      <circle cx="430" cy="455" r="34" fill="#3f6f93"/>
      <rect x="396" y="455" width="68" height="42" fill="#f4f1ea"/>`,
    );
  },
  serengeti() {
    return doc(
      skyGrad("sky", "#f3d9ad", "#e0a45e"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(600, 430, 170, "#d4663b", 0.9)}
      <path d="${hill(560, 40, 0.4)}" fill="#a8642f"/>
      <rect x="0" y="640" width="${W}" height="${H}" fill="#7c4422"/>
      ${acacia(330, 645, "#46220f")}
      ${acacia(900, 700, "#3a1c0c")}`,
    );
  },
  kyoto(rnd) {
    return doc(
      skyGrad("sky", "#f4e2dc", "#d8a3a4"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(840, 300, 110, "#c96f5e", 0.85)}
      <path d="${range(480, 130, 7, rnd)}" fill="#b07e8a" opacity="0.7"/>
      <path d="${range(580, 150, 6, rnd)}" fill="#7d5468"/>
      <path d="${range(700, 120, 5, rnd)}" fill="#4a3247"/>
      <g fill="#33222f">
        <rect x="190" y="600" width="14" height="120"/>
        <rect x="316" y="600" width="14" height="120"/>
        <rect x="160" y="586" width="200" height="16"/>
        <path d="M150,586 Q260,556 370,586 L370,572 Q260,540 150,572 Z"/>
        <rect x="236" y="640" width="48" height="80"/>
      </g>`,
    );
  },
  napa() {
    return doc(
      skyGrad("sky", "#f4ecd7", "#dcc89a"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(330, 250, 85, "#e3b667")}
      <path d="${hill(470, 90, 1.2)}" fill="#b3a35e"/>
      <path d="${hill(540, 70, 2.6)}" fill="#8a8a46"/>
      <rect x="0" y="600" width="${W}" height="${H}" fill="#5d6b35"/>
      ${vineRows(600, "#39451f")}`,
    );
  },
  zermatt(rnd) {
    return doc(
      skyGrad("sky", "#eef3f6", "#c3d6e2"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(920, 220, 70, "#f4ead2")}
      <polygon points="380,640 600,180 700,330 760,250 980,640" fill="#9fb6c6"/>
      <polygon points="380,640 600,180 660,272 530,640" fill="#eaf1f5"/>
      <path d="${range(620, 120, 6, rnd)}" fill="#6f8a9d"/>
      <path d="${range(720, 100, 5, rnd)}" fill="#41576a"/>`,
    );
  },
  amalfi(rnd) {
    return doc(
      skyGrad("sky", "#f7e8d8", "#e8b88f"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(760, 260, 90, "#e89a5f")}
      <path d="${range(430, 180, 5, rnd)}" fill="#c97e57"/>
      <path d="${range(560, 160, 4, rnd)}" fill="#9d5538"/>
      ${seaBands(660, ["#4f8d96", "#34707d", "#235463"], rnd)}
      <g fill="#f4ead8">
        <rect x="200" y="470" width="34" height="26"/><rect x="252" y="446" width="30" height="24"/>
        <rect x="230" y="500" width="40" height="28"/><rect x="290" y="478" width="28" height="22"/>
      </g>`,
    );
  },
  iceland(rnd) {
    return doc(
      skyGrad("sky", "#10243a", "#1d4256"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${aurora("#5fd6a8")}
      ${sun(940, 200, 46, "#e8ecef", 0.9)}
      <path d="${range(620, 140, 6, rnd)}" fill="#11303d"/>
      <path d="${range(730, 100, 5, rnd)}" fill="#081d26"/>
      ${seaBands(800, ["#0c2933", "#06181f"], rnd)}`,
    );
  },
  "bora-bora"(rnd) {
    return doc(
      skyGrad("sky", "#f0e7d3", "#a7d6cd"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(280, 240, 80, "#f1cd92")}
      <polygon points="500,480 700,210 800,330 880,290 1010,480" fill="#3f7268"/>
      ${seaBands(480, ["#7fcabc", "#4aa99e", "#2a8480", "#1c6466"], rnd)}
      ${palm(1000, 520, "#174f48")}`,
    );
  },
  patagonia(rnd) {
    return doc(
      skyGrad("sky", "#e9eef0", "#b3c6cb"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(260, 220, 64, "#e8d9b8")}
      <polygon points="420,620 540,170 600,340 660,200 740,360 800,250 940,620" fill="#5d7480"/>
      <polygon points="420,620 540,170 590,320 500,620" fill="#dfe8ec"/>
      <polygon points="660,200 740,360 800,250 838,330 700,620 640,620" fill="#d2dde2" opacity="0.8"/>
      <path d="${range(640, 110, 6, rnd)}" fill="#3c545f"/>
      ${seaBands(760, ["#5d8a8a", "#3a6166"], rnd)}`,
    );
  },
  paris(rnd) {
    return doc(
      skyGrad("sky", "#f3e9da", "#d3b89c"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(330, 270, 95, "#e0aa6a", 0.9)}
      ${skyline(620, "#5a4a44", rnd, true)}
      <rect x="0" y="780" width="${W}" height="${H}" fill="#483a36"/>`,
    );
  },
  dubai(rnd) {
    return doc(
      skyGrad("sky", "#f6dfc2", "#e2a06b"),
      `<rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${sun(820, 320, 130, "#d96f44", 0.85)}
      <polygon points="${W / 2 - 36},640 ${W / 2 - 6},150 ${W / 2 + 2},150 ${W / 2 + 30},640" fill="#6b4a3e"/>
      ${skyline(640, "#6b4a3e", rnd)}
      <path d="${hill(800, 50, 0.8)}" fill="#54382e"/>`,
    );
  },
};

mkdirSync(OUT, { recursive: true });
for (const [slug, render] of Object.entries(scenes)) {
  const svg = render(seeded(slug));
  writeFileSync(join(OUT, `${slug}.svg`), svg);
  console.log(`art/${slug}.svg`);
}
