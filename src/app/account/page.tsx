import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Account from "@/pages/Account";

export const metadata: Metadata = buildPageMetadata({
  title: "My Account",
  description: "Manage your Fuel & Nutrients customer account.",
  path: "/account",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Account />;
}
