import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/pages/admin/Dashboard";


export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dashboard — Hkwallet Admin" },
      { name: "description", content: "Dashboard in the Hkwallet admin console." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});
