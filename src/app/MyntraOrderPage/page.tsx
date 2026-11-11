import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import OrderPage from "@/pages/myorder";

export const metadata: Metadata = buildPageMetadata({
  title: "My Orders",
  description: "View your order history on Fuel & Nutrients.",
  path: "/account/orders",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <OrderPage />;
}
