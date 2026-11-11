import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import TrackOrder from "@/pages/trackOrder";

export const metadata: Metadata = buildPageMetadata({
  title: "Track Order",
  description: "Track your order delivery status on Fuel & Nutrients.",
  path: "/account/track",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <TrackOrder />;
}
