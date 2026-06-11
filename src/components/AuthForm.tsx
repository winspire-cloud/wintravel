"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";

const INITIAL: AuthState = { error: null };

type Mode = "login" | "signup";
type Audience = "customer" | "vendor";

const COPY: Record<Audience, Record<Mode, { title: string; sub: string; cta: string }>> = {
  customer: {
    login: {
      title: "Welcome back",
      sub: "Sign in to track your bids and book your wins.",
      cta: "Sign In",
    },
    signup: {
      title: "Join Win Travel",
      sub: "Create a free account to start bidding on extraordinary trips.",
      cta: "Create Account",
    },
  },
  vendor: {
    login: {
      title: "Vendor sign in",
      sub: "Access your inventory console and order pipeline.",
      cta: "Sign In to Console",
    },
    signup: {
      title: "Become a vendor",
      sub: "List your properties and experiences in front of motivated bidders.",
      cta: "Apply as Vendor",
    },
  },
};

export function AuthForm({
  mode,
  audience,
  next,
}: {
  mode: Mode;
  audience: Audience;
  next?: string;
}) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const copy = COPY[audience][mode];

  return (
    <div className="w-full max-w-md border border-hairline bg-white p-8 sm:p-10">
      <p className="kicker text-bronze">
        {audience === "vendor" ? "Vendor Portal" : "Traveler Account"}
      </p>
      <h1 className="mt-3 text-3xl font-black">{copy.title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{copy.sub}</p>

      <form action={formAction} className="mt-8 space-y-4">
        {mode === "signup" && audience === "vendor" && (
          <input type="hidden" name="role" value="vendor" />
        )}
        {next && <input type="hidden" name="next" value={next} />}

        {mode === "signup" && (
          <Field label="Full name" name="full_name" type="text" autoComplete="name" />
        )}
        {mode === "signup" && audience === "vendor" && (
          <Field label="Company" name="company" type="text" autoComplete="organization" />
        )}
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />

        {state.error && (
          <p className="border border-claret/30 bg-claret/5 px-4 py-3 text-sm text-claret">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="kicker w-full bg-ink py-4 text-white transition-colors hover:bg-bronze disabled:opacity-50"
        >
          {pending ? "One moment…" : copy.cta}
        </button>
      </form>

      <div className="mt-6 border-t border-hairline pt-5 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link
              href={audience === "vendor" ? "/vendor/signup" : "/signup"}
              className="font-bold text-bronze hover:underline"
            >
              {audience === "vendor" ? "Apply as a vendor" : "Create an account"}
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href={audience === "vendor" ? "/vendor/login" : "/login"}
              className="font-bold text-bronze hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="kicker text-faint">{label}</span>
      <input
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-1.5 w-full border border-hairline px-4 py-3 text-sm outline-none transition-colors focus:border-bronze"
      />
    </label>
  );
}
