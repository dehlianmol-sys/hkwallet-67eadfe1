import { createFileRoute } from "@tanstack/react-router";

import Banners from "@/pages/admin/Banners";
import { RequireSuperAdmin } from "@/components/Guards";

export const Route = createFileRoute("/admin/banners")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Banners — Hkwallet Admin" },
      { name: "description", content: "Banners in the Hkwallet admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (<RequireSuperAdmin><Banners /></RequireSuperAdmin>),
});
