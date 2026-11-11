import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Account from "@/pages/Account";

export const metadata: Metadata = buildPageMetadata({
  title: "Notifications",
  description: "Manage your account notifications on Fuel & Nutrients.",
  path: "/account/notifications",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Account />;
}
