<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurrly Expo app. Here is a summary of all changes made:

- **`app.config.js`** (new): Converts the static `app.json` into a dynamic config that exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables via `expo-constants` extras.
- **`src/config/posthog.ts`** (new): Initialises the PostHog client with batching, feature flag preloading, retry logic, and app lifecycle event capture. The client is disabled automatically when the token is not configured.
- **`app/_layout.tsx`**: Wraps the app with `PostHogProvider` (inside `ClerkProvider`) and adds manual screen tracking with `posthog.screen()` on every `pathname` change using Expo Router's `usePathname` / `useGlobalSearchParams`.
- **`app/(auth)/sign-in.tsx`**: Tracks `user_signed_in` (with `method` property) and `user_sign_in_failed` (with `error_code`). Calls `posthog.identify()` with the Clerk session ID on successful password and MFA sign-in.
- **`app/(auth)/sign-up.tsx`**: Tracks `user_signed_up` on completed email verification and `user_sign_up_failed` on errors. Calls `posthog.identify()` with the Clerk user ID on successful account creation.
- **`app/(tabs)/settings.tsx`**: Tracks `user_signed_out` and calls `posthog.reset()` before sign-out to clear the PostHog identity.
- **`app/(tabs)/index.tsx`**: Tracks `subscription_expanded` and `subscription_collapsed` with `subscription_id` whenever a card is toggled on the home screen.
- **`.env`**: `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added.
- **Packages installed** (background): `posthog-react-native`, `react-native-svg`.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully completes sign-in (password or MFA) | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | Sign-in attempt fails (includes `error_code`) | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | New user completes email verification and account creation | `app/(auth)/sign-up.tsx` |
| `user_sign_up_failed` | Sign-up attempt fails (includes `error_code`) | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User taps Sign Out on the settings page | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User expands a subscription card (includes `subscription_id`) | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | User collapses an expanded subscription card (includes `subscription_id`) | `app/(tabs)/index.tsx` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1607160)
- [Sign-ups over time](/insights/J8KQ9zdy) — daily new sign-ups
- [Sign-ins over time](/insights/IGjiZvNP) — daily active signing-in users
- [Sign-up to sign-in conversion funnel](/insights/j43sKWrs) — conversion from account creation to first login
- [Sign-in failures](/insights/bY6K4Dkn) — authentication error rate
- [User churn (sign-outs)](/insights/Z5cCKdPK) — daily sign-out signal

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
