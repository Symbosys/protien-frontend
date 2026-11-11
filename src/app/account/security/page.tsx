import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import LoginSecurity from "@/pages/LoginSecurity";

export const metadata: Metadata = buildPageMetadata({
  title: "Login & Security",
  description: "Manage your Fuel & Nutrients security settings.",
  path: "/account/security",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <LoginSecurity />;
}
