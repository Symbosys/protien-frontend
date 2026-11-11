import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import SavedAddresses from "@/pages/savedAddress";

export const metadata: Metadata = buildPageMetadata({
  title: "Saved Addresses",
  description: "Manage your delivery addresses on Fuel & Nutrients.",
  path: "/account/addresses",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <SavedAddresses />;
}
