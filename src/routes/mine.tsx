import { createFileRoute } from "@tanstack/react-router";

import Mine from "@/pages/Mine";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/mine")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Account — Hkwallet" },
      { name: "description", content: "View your Hkwallet balance, order history and account settings." },
      { property: "og:title", content: "My Account — Hkwallet" },
      { property: "og:description", content: "View your Hkwallet balance, order history and account settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout><Mine /></UserLayout>
    </RequireUser>
  ),
});
