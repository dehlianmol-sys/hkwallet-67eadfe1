import { createFileRoute } from "@tanstack/react-router";

import Login from "@/pages/Login";
import { RedirectIfAuthed } from "@/components/Guards";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Login — Hkwallet" },
      { name: "description", content: "Sign in to your Hkwallet wallet to manage deposits and rewards." },
      { property: "og:title", content: "Login — Hkwallet" },
      { property: "og:description", content: "Sign in to your Hkwallet wallet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RedirectIfAuthed>
      <Login />
    </RedirectIfAuthed>
  ),
});
