# G Pandey Trust website (GP O)

Responsive website for **G Pandey Trust** (Dr. Gangeshwar Pandey Trust, Bhojpur, Bihar), a non-profit working on food rescue, ration distribution, training camps and relief work. Built with Angular (standalone components, signals, SCSS) and based on the 11-page Canva design shared for the project.

Sections, in page order: header with contact line and "Here for You" button, hero photo, Hindi tagline, donate call to action with about text, three framed programme sections (training camp, meet-up, food camp and ration distribution), impact statistics, media coverage and appreciation sections, photo gallery, and a closing "Jeevan Jayate" section. It adapts from desktop to mobile, including a collapsing navigation menu.

## Requirements

- Node.js 22.22.3+ (or 24.15+), which the current Angular CLI requires
- npm

## Run locally

```bash
npm install
npm start -- --host 0.0.0.0 --port 47213
```

Then open http://localhost:47213.

## Other commands

```bash
npm run build   # production build into dist/gp-o
npm test        # unit tests (Vitest via the Angular CLI)
```

## Deploy to Firebase

The site deploys to Firebase Hosting (project and site `gp-org-ba8db`). The config is in `firebase.json` and `.firebaserc`, and the production build is served from `dist/gp-o/browser`.

```bash
npx --yes firebase-tools login
npm install
npm run deploy
```

`npm run deploy` runs `ng build --configuration production` and then `npx --yes firebase-tools deploy --only hosting`, so no global Firebase install is needed. Use a Node version the Angular CLI supports (22.22.3+).

## Automatic deploys

GitHub Actions deploy to Firebase Hosting (`gp-org-ba8db`) automatically:

- `.github/workflows/firebase-hosting-merge.yml` builds and deploys to the live channel on every push to `main`.
- `.github/workflows/firebase-hosting-pull-request.yml` builds and deploys a preview channel for every pull request from this repository (pull requests from forks are skipped) and comments the preview URL on the pull request.

Both workflows use Node 22 and run `npm ci` and `npm run build -- --configuration production`.

### One-time setup

The workflows need a repository secret named `FIREBASE_SERVICE_ACCOUNT_GP_ORG_BA8DB`. No credentials are stored in the repo. Pick one option.

Option A, with the Firebase CLI (creates the service account and the secret for you):

```bash
npx --yes firebase-tools login
npx --yes firebase-tools init hosting:github
```

When prompted, choose project `gp-org-ba8db` and this GitHub repository. Decline overwriting `firebase.json` and the existing workflow files if asked, and keep the secret name `FIREBASE_SERVICE_ACCOUNT_GP_ORG_BA8DB`.

Option B, manually:

1. In the Firebase console, open Project settings > Service accounts for `gp-org-ba8db`.
2. Click Generate new private key and download the JSON file.
3. Make sure the service account has the Firebase Hosting Admin role (IAM page of the Google Cloud console). The CLI-created account has it by default.
4. In GitHub, open the repository Settings > Secrets and variables > Actions > New repository secret.
5. Name it `FIREBASE_SERVICE_ACCOUNT_GP_ORG_BA8DB` and paste the full contents of the JSON file as the value.
6. Delete the downloaded JSON file from your machine.

After that, pushing to `main` deploys the live site, and opening a pull request gives you a preview URL.

## Structure

- `src/app/app.ts` holds the page content (sections, stats, gallery) and menu state
- `src/app/app.html` is the page template
- `src/app/app.scss` has the component styles
- `src/styles.scss` defines global design tokens (colors, fonts) and base styles
- `public/images/` contains the photos and logos taken from the Canva design

## Design notes

- Colors: sky blue `#6cc5e4` (header), bright blue `#0099dd` (stats and Hindi tagline), light blue `#7dd6f4` (accent blocks), charcoal `#3e3e43` (photo frames and buttons), tan `#d9d1c9` (footer).
- Fonts: Libre Baskerville (serif headings and body), Poppins (sans), and Noto fonts for Devanagari text, loaded from Google Fonts.
- Page 11 of the design is an internal note about reusing the footer of the GP Org site, so it is not rendered.
