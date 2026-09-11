import { createFileRoute } from "@tanstack/react-router";

import Register from "@/pages/Register";
import { RedirectIfAuthed } from "@/components/Guards";
import { REF_CODE_KEY } from "@/lib/agents";

/**
 * Single-domain referral entry point: https://hkwallet.site/<referral_code>/register
 * The code is captured into localStorage before the form renders, so it survives
 * refreshes and is available to the sign-up call.
 */
export const Route = createFileRoute("/$referralCode/register")({
  ssr: false,
  beforeLoad: ({ params }) => {
    const code = (params.referralCode ?? "").trim().toUpperCase();
    if (code && typeof window !== "undefined") {
      try {
        localStorage.setItem(REF_CODE_KEY, code);
      } catch {
        /* storage unavailable — the URL param below still applies the code */
      }
    }
  },
  head: () => ({
    meta: [
      { title: "Join Hkwallet With Your Invite Code" },
      {
        name: "description",
        content:
          "Register on Hkwallet using your friend's invite link, then download the app and start earning.",
      },
      { property: "og:title", content: "Join Hkwallet With Your Invite Code" },
      {
        property: "og:description",
        content: "Sign up with an invite code and download the Hkwallet app.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferralRegister,
});

function ReferralRegister() {
  const { referralCode } = Route.useParams();
  return (
    <RedirectIfAuthed>
      <Register referralCode={referralCode} />
    </RedirectIfAuthed>
  );
}
