import { isSupabaseConfigured } from "@/lib/supabase/config";

export function DemoBanner() {
  if (isSupabaseConfigured()) return null;
  return (
    <div className="border border-bronze/30 bg-bronze/5 px-5 py-3.5 text-sm text-bronze-deep">
      <span className="font-bold">Demo mode.</span> Showing sample data — connect a Supabase
      project (see <code className="font-bold">.env.example</code> and{" "}
      <code className="font-bold">supabase/</code>) to enable live accounts, bidding, and
      inventory.
    </div>
  );
}
