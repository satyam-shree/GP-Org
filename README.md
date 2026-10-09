# G Pandey Trust website (GP O)

Responsive website for **G Pandey Trust** (Dr. Gangeshwar Pandey Trust, Bhojpur, Bihar), a non-profit working on food rescue, ration distribution, training camps and relief work. Built with Angular (standalone components, signals, SCSS) and based on the 11-page Canva design shared for the project.

The home page, in order: header with a blue ticker strip (registration copy plus English | Hindi) and a "Here for You" button, a three-photo hero carousel (existing children's-hands photo plus two camp collages), tagline, donate call to action, a pink Jeevan Jayate about band, an Our Fields of Work icon row, a Making Efforts That Count band (left copy, right looping Polaroid photo stack), three framed programme sections (training camp, meet-up, food camp and ration distribution), impact statistics with a count-up when the banner scrolls into view, media coverage and appreciation sections, photo gallery, and a closing "Jeevan Jayate" motto. **Contact Us** is a separate page at `/contact` with a form and placeholder details. The layout stays responsive on tablet and phone.

## Requirements

- Node.js 22.22.3+ (or 24.15+), which the current Angular CLI requires
- npm

## Run locally

```bash
npm install
NG_CLI_ANALYTICS=false npm start -- --host 0.0.0.0 --port 47213
```

Then open http://localhost:47213.

## Other commands

```bash
npm run build   # production build into dist/gp-o
npm test        # unit tests (Vitest via the Angular CLI)
```

## Routes

| Path       | Page                                                     |
| ---------- | -------------------------------------------------------- |
| `/`        | Home (About Us is the donate/about section on this page) |
| `/contact` | Contact Us                                               |

Firebase Hosting rewrites every path to `/index.html` so those routes work on the live site.

## Contact form

The contact form has no backend. On a valid submit it opens a prefilled `mailto:` to `contact@gpandeytrust.org` and shows a thank-you state.

To change the public email, phone or place, edit `src/app/contact/contact.constants.ts` (look for the `TODO` on `CONTACT_EMAIL`). The ticker “click here to visit all certificates” link uses `CERTIFICATES_HREF` in that file until a certificates URL exists.

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

- `src/app/app.ts` is the site shell (sticky header, navigation, footer)
- `src/app/app.routes.ts` maps `/` to home and `/contact` to the contact page
- `src/app/home/` is the home page, including the stats count-up
- `src/app/polaroid-stack/` is the reusable Polaroid photo-stack carousel used on home
- `src/app/contact/` is the Contact Us page and the email/phone placeholders
- `src/styles.scss` defines global design tokens (colors, fonts, page gutter)
- `public/images/` contains the photos and logos taken from the Canva design

## Design notes

- Colors: cream yellow `#fcffd5` (page and unscrolled header, sampled from the Appinventiv Foundation screenshot), black `#111` (scrolled header and stats banner), CONTACT-style blue `#3169f2` (Here for You, top contact strip, and quote accent), charcoal `#3e3e43` (photo frames), gold `#e0d894` (Donate For Good Cause box), soft pink `#fbe7eb` (Jeevan Jayate about band).
- The Hindi tagline under the hero breaks after वाला onto two lines, slightly larger than the surrounding body type. The hero keeps its halved height and auto-slides three cover-cropped photos in a loop (paused on hover; first slide only when the visitor prefers reduced motion).
- The header is sticky. At the top of the page it is transparent so it matches the cream background; after a short scroll it becomes a dark bar with light nav text and the blue Here for You button. The two-line site name loops a 4s English ↔ Hindi clip-path wipe. The blue strip has a right-to-left registration ticker on the left and English | Hindi on the right; choosing a language jumps the wipe to that pair, then the loop continues (static when the visitor prefers reduced motion). The ticker pauses on hover and is truncated when motion is reduced. The tagline follows the selected language.
- The Donate For Good Cause panel is an inset card with 40px corners, not full-bleed; the banner photo uses the same radius. A short blurb under the heading explains the Trust’s camps and donations. Below it, a pink **Jeevan Jayate** band restyles the Trust about copy, with a Read More… pill to Contact, then a white **Our Fields of Work** row (Education, Health, Livelihood, Protection, Humanitarian) with the site blue heading. Directly under that row, a white award band uses the two-column highlight: the headline **Making Efforts That Count**, grey body copy, and a reusable Polaroid photo stack (`app-polaroid-stack`) that auto-plays through Trust photos.
- Fonts: Libre Baskerville (serif headings and body), Poppins (sans), and Noto fonts for Devanagari text, loaded from Google Fonts.
- Page 11 of the design is an internal note about reusing the footer of the GP Org site, so it is not rendered.
