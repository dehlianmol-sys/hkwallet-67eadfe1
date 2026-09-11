import { createFileRoute } from "@tanstack/react-router";

import Team from "@/pages/Team";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/team")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Team — Hkwallet" },
      { name: "description", content: "Track your referrals, team size and commission earnings on Hkwallet." },
      { property: "og:title", content: "My Team — Hkwallet" },
      { property: "og:description", content: "Track your referrals, team size and commission earnings on Hkwallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><Team /></UserLayout>
    </RequireUser>
  ),
});
