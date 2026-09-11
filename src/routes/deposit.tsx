import { createFileRoute } from "@tanstack/react-router";

import Deposit from "@/pages/Deposit";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/deposit")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Deposit — Hkwallet" },
      { name: "description", content: "Add funds to your Hkwallet wallet with UPI in seconds." },
      { property: "og:title", content: "Deposit — Hkwallet" },
      { property: "og:description", content: "Add funds to your Hkwallet wallet with UPI in seconds." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><Deposit /></UserLayout>
    </RequireUser>
  ),
});
