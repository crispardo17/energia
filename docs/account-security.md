# Account security

Email/password accounts use managed Neon Auth. Passwords and verification codes are not stored by the course application. Verification and recovery use the managed Email OTP methods exposed by the installed `@neon/auth` client.

## Production configuration

On main, require email verification, use OTP, send verification at signup/signin, and revoke sessions on password reset. Preserve existing Google credentials and other Auth settings. The user can request/resend a verification code from the login dialog, including accounts created before verification became mandatory. Existing account IDs and learning progress are preserved.

The login dialog includes password recovery: email → code plus new password twice → return to login. Request messages avoid disclosing whether an email exists. Confirmation stays in browser memory and is never sent. Codes are checked/consumed by Neon. The UI handles throttling responses and applies a one-minute resend cooldown; this cooldown is usability, not a server-side security boundary.

## Immediate session revocation

Every protected course request sends the signed JWT and its SDK session ID in `X-Session-Id`. The API verifies signature/issuer/audience/expiry, then checks that the session still exists in `neon_auth.session`, belongs to the JWT subject and has not expired. The current user must also be verified and not banned. Session IDs alone never authenticate. Resetting a password removes the user's sessions, so an old JWT with the revoked session is refused immediately, rather than only when the JWT expires. Existing open tabs may need reloading to obtain the updated client.

## Verification

`npm test` covers credential validation, provider operation selection, confirmation omission, neutral unknown-account responses and throttling errors. `AUTH_TEST_BRANCH=dev-auth-security-... node scripts/checkAuthSecurity.js` is restricted to an isolated test branch. It creates only a synthetic identity, confirms unverified sign-in is blocked, substitutes a known hash for that identity's OTP in the isolated branch (no real user codes are read), verifies email, resets the password, and checks old sessions/password/code cannot be reused. Synthetic records are deleted afterwards. This test does not prove delivery to a real inbox.

## Remaining limits

The current email sender is Neon's shared development sender. OTP works, but production requires the owner's dedicated SMTP configuration for reliable delivery and higher limits. No SMTP credentials were invented or replaced. Google configuration is preserved. Native MFA and a breached-password blocklist were not added. Managed OTP expiry/attempt protections are provided by Neon; a custom login lockout policy has not been configured or independently load-tested. Do not represent a browser cooldown as brute-force protection.

## Mobile Google return and first-party cookies

The browser now calls `/api/session/*` on Angkor's origin. `server/session-proxy.js` uses the installed Neon's supported `handleAuthRequest` toolkit to reach the existing managed Auth service. It forwards only the login/session/verification/recovery endpoints used by this app. Cookies are emitted for the application host with Secure, HttpOnly and SameSite=Lax; remote Domain and Partitioned attributes are removed. This keeps the OAuth challenge and session available without third-party cookie support. No authentication provider, user IDs or stored learning data change.

Origin and method checks occur before forwarding POST requests. Unknown paths and hosts are rejected, URLs are pinned to the configured HTTPS Neon service, and cookies unrelated to Neon are filtered by the toolkit. The app does not mint its own auth identity or persist tokens in localStorage. Get-session always reaches managed Auth and preserves `set-auth-jwt`; the toolkit's optional session-data cache is deliberately not used, since course APIs need the managed JWT and current session ID.

Redirect configuration canonicalizes the previous energia-alpha hostname if that hostname is attached to this deployment. The supported login entry is https://angkor-academy.vercel.app. Expired/invalid OAuth return verifiers are removed from the URL and show an actionable login retry dialog rather than a raw HTTP 400. Existing sessions on the former cross-domain client may require signing in once again; learning history is keyed to the same managed user IDs.

Validation: unit tests for path/method/origin restrictions, cookie attributes and JWT/query forwarding; `AUTH_TEST_BRANCH=dev-auth-mobile-... node scripts/checkMobileAuth.js` for real managed signup/verification/login/session restoration/logout and Google challenge creation on an isolated branch. These checks do not complete an interactive Google login on a physical iPhone; the user's affected phone remains the final compatibility check.
