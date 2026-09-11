import { createFileRoute } from "@tanstack/react-router";

import UPI from "@/pages/UPI";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/upi")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "UPI Tools — Hkwallet" },
      { name: "description", content: "Manage your linked UPI accounts and buy or sell orders on Hkwallet." },
      { property: "og:title", content: "UPI Tools — Hkwallet" },
      { property: "og:description", content: "Manage your linked UPI accounts and buy or sell orders on Hkwallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><UPI /></UserLayout>
    </RequireUser>
  ),
});
