# sankhyaailabs.com

One Vite + React app on Vercel, in two halves.

- **The public site** (`src/site/`): Manu, the case diary that reads the court,
  from Sankhya AI Labs. `/` and `/about`, in Tura's design. The same source
  lives in the Manu repo as `apps/site`; change it there and copy it across
  (imports here are `@/site/...`).
- **The account half** (`src/account/`, `src/pages/AccountPage.tsx`,
  `src/pages/PrivacyPage.tsx`, `src/components/account/`): sign-in, billing,
  the desktop hand-off and the privacy policy, on their own Tailwind sheet,
  loaded only when visited. Moving between the halves is a full page load, so
  the two stylesheets never apply at once.
- **The API** (`api/`, `vercel.json` rewrites and the nightly cron): payments,
  licences, downloads, the update feed. Unchanged by the site.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npm test         # API tests
```

`VITE_MANU_APP_URL` is the diary's address. Until it is set, every
"Open Manu" on the site is "Request access", an email to hello@sankhyaailabs.com.
