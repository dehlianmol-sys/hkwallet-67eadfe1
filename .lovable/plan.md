# Production integration and security plan

## Scope

Import the uploaded repository into this project without its Git metadata, preserving the exact visual markup and styling of the supplied Deposit, Mine, Team, and related Team screen files. Connect those screens to real authenticated data and provide one idempotent SQL migration for the existing database.

## Implementation

1. **Adopt and stabilize the uploaded repository**
   - Copy the application source, assets, configuration, and existing SQL into the current project while excluding repository metadata.
   - Resolve the uploaded code’s router/import incompatibilities and confirm every content page retains its own metadata.
   - Treat `src/pages/Deposit.tsx`, `src/pages/Mine.tsx`, and `src/pages/Team.tsx` as design-locked: only data bindings and event behavior will change. The archive does not contain `teamdocs.ts`; no missing design can be reconstructed without that file.

2. **Replace insecure account handling**
   - Use the existing authentication service session as the sole user identity; remove plaintext password reads/writes and the forgeable profile-ID local-storage session.
   - Link `profiles.id` to the authenticated account ID and keep roles in a separate `user_roles` table.
   - Keep phone/password login compatibility by using the app’s deterministic internal email mapping, while never exposing that mapping or profile rows publicly.
   - Add session-aware login, logout, registration, route protection, and cache cleanup.

3. **Secure OTP and registration**
   - Call a narrow `check_user_exists(phone)` RPC before requesting an OTP.
   - Keep the existing per-phone local-storage exponential cooldown for user feedback, while adding server-enforced OTP issuance and verification so browser state cannot bypass verification.
   - Route `/` to Login without a referral and to Registration for `/?ref=...`; always send a successful registration to `/download`.
   - Create the profile during verified signup with a database-generated unique referral code and a fixed default avatar URL.

4. **Wire the design-locked screens**
   - **Team:** load the signed-in user’s referral code, build/copy their real `/?ref=CODE` link, and fetch today/total member and commission summaries.
   - **Mine:** read the persisted `avatar_url`; remove randomized avatar selection while retaining the existing fallback presentation. Bind available earnings/history figures where supported by current transaction data.
   - **Deposit/Payment:** move order creation, cancellation, proof submission, approval/rejection, rewards, and balance mutation into authenticated database functions with ownership/admin checks and atomic updates.
   - Wire the remaining supplied controls only where the archive includes a corresponding destination or existing data source; do not invent missing pages.

5. **Database migration and compatibility**
   - Add/backfill `profiles.referral_code`, `profiles.referred_by`, `profiles.avatar_url`, and authentication linkage as needed.
   - Add `user_roles`, OTP challenge/rate-limit storage, referral summary functions, and secure deposit functions.
   - Add foreign keys, uniqueness constraints, grants, RLS, owner/admin policies, and security-definer helpers with fixed search paths.
   - Revoke the archive’s blanket anonymous CRUD grants and ensure private columns are never selectable from the browser.
   - Preserve existing data with guarded, idempotent statements and include exact execution notes in a production SQL file.

6. **Validation**
   - Run focused type/build checks.
   - Exercise direct login, referral registration routing, duplicate-phone OTP prevention, cooldown persistence, signup-to-download, fixed avatar reload, referral copying, team totals, and deposit ownership boundaries in the live preview where backend connectivity permits.
   - Document any validation that requires the user’s existing external database/SMS secret or the absent `teamdocs.ts` source.

## Deliverables

- Updated integrated application code with the supplied screen designs preserved.
- A complete SQL migration ready for the existing database SQL Editor.
- A concise launch note identifying required environment values, SMS provider setup, migration order, and any blockers that cannot be completed from this archive.
