import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo-config";
import PersonalInformation from "@/pages/personalinformation";

export const metadata: Metadata = buildPageMetadata({
  title: "Personal Information",
  description: "Manage your personal details on Fuel & Nutrients.",
  path: "/account/personal-information",
  noIndex: true,
  follow: false,
});

export default function Page() {
  return <PersonalInformation />;
}
