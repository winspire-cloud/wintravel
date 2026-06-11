import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "Sign In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-paper px-6 py-20">
        <AuthForm mode="login" audience="customer" next={next} />
      </main>
      <SiteFooter />
    </>
  );
}
