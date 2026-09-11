import { createFileRoute } from "@tanstack/react-router";

import CustomerServicePage from "@/pages/CustomerService";
import UserLayout from "@/components/UserLayout";
import { RequireUser } from "@/components/Guards";

export const Route = createFileRoute("/customer-service")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Customer Support — Hkwallet" },
      { name: "description", content: "Reach the Hkwallet support team on WhatsApp, Telegram and more." },
      { property: "og:title", content: "Customer Support — Hkwallet" },
      { property: "og:description", content: "Reach the Hkwallet support team any time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <RequireUser>
      <UserLayout>
        <CustomerServicePage />
      </UserLayout>
    </RequireUser>
  ),
});
