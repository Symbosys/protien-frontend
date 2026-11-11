import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import Login from "@/pages/Login";

export const metadata: Metadata = buildPageMetadata({
  title: "Sign In or Create Account",
  description: "Sign in to your Fuel & Nutrients customer account.",
  path: "/login",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <Login />;
}
