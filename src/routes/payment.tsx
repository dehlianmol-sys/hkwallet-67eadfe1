import { createFileRoute } from "@tanstack/react-router";

import Payment from "@/pages/Payment";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/payment")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Complete Payment — Hkwallet" },
      { name: "description", content: "Finish your pending Hkwallet deposit and upload the payment receipt." },
      { property: "og:title", content: "Complete Payment — Hkwallet" },
      { property: "og:description", content: "Finish your pending Hkwallet deposit and upload the payment receipt." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <Payment />
    </RequireUser>
  ),
});
