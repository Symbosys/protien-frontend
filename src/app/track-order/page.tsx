import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import TrackOrder from "@/pages/trackOrder";

export const metadata: Metadata = buildPageMetadata({
  title: "Track Your Order",
  description:
    "Track your Fuel & Nutrients (M/S Protein and Nutrients) supplement order delivery status.",
  path: "/track-order",
  noIndex: true,
  follow: true,
});

export default function Page() {
  return <TrackOrder />;
}
