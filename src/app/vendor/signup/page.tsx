import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Become a Vendor" };

export default function VendorSignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-paper px-6 py-20">
        <AuthForm mode="signup" audience="vendor" />
      </main>
      <SiteFooter />
    </>
  );
}
