import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import OrderDetails from "@/pages/OrderDetails";

export const metadata: Metadata = buildPageMetadata({
  title: "Order Details",
  description: "View order details on Fuel & Nutrients.",
  path: "/account/orders",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <OrderDetails />;
}
