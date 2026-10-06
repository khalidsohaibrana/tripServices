# Contributing

This repository contains a shared React Native invoice application and one or more branded app profiles. Keep shared behavior in the application code and brand-specific values in `brands/<brand-id>/`.

## Before Editing

1. Read [the architecture guide](docs/architecture.md) and [the white-label guide](docs/white-label.md).
2. Check the current branch and working tree.
3. Run `npm install` if dependencies are missing.
4. Run `npm run brand:validate-all`, `npm run lint`, and `npm test -- --runInBand` before making broad changes.

Preserve unrelated working-tree changes. Do not commit generated output from a brand preparation step.

## Branches and Pull Requests

Use this flow:

- `develop` is the integration branch for shared features and brand profiles.
- `main` is the release baseline.
- `brand/<brand-id>` is optional and should be used only when a brand needs an independent release schedule or temporary behavior.

Create feature branches from the current `develop` branch. Pull requests for shared work target `develop`. Promote tested changes to `main` through a separate release PR. Keep PRs focused and explain the affected brands, tests, native build results, and any required secrets or store configuration.

Use clear branch names such as `feature/invoice-tax-label`, `fix/dark-calendar`, or `brand/example-client`. Do not put a customer’s private credentials in a branch or commit.

## Where Changes Belong

| Change | Location |
| --- | --- |
| Company name, address, bank details, currency, copy | `brands/<id>/config.json` |
| Logo, icon, background, launch artwork | `brands/<id>/assets/` |
| Shared colors and theme behavior | `src/theme/` plus the brand theme values |
| Invoice calculations | `src/services/invoices/utils.js` |
| Form rules | `src/components/invoices/InvoiceForm/validationSchema.js` |
| Invoice preview | `src/components/invoices/InvoiceModal/` |
| Invoice PDF | `src/services/invoices/template.js` |
| Native brand preparation | `scripts/brand.js`, Android Gradle, iOS build settings |
| Generated selected brand and native assets | Never edit or commit; run the brand preparation command |

If a new requirement can be expressed as data, add it to the brand configuration. If it changes behavior for every customer, implement it in shared code. If only one customer needs different behavior, first check whether a configuration flag or strategy can express it without copying a feature into a brand branch.

## Required Checks

Run these before opening a PR:

```bash
npm run brand:validate-all
npm run lint
npm test -- --runInBand
npm run brand:prepare -- trip-services
```

For changes affecting native code or brand assets, also run:

```bash
./gradlew :app:assembleBrandedDebug --offline
xcodebuild -workspace TripServices.xcworkspace \
  -scheme TripServices \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  -xcconfig Brand.xcconfig \
  CODE_SIGNING_ALLOWED=NO build
```

Install the Android build on an emulator when changing layout, theme, permissions, or native configuration. Inspect both light and dark mode. For invoice changes, inspect the preview and generated PDF, including currency formatting, escaping, totals, optional fields, and brand details.

## Brand Changes

Copy an existing profile, give it a unique lowercase ID, replace its configuration and assets, then run:

```bash
npm run brand:validate -- new-brand
npm run android -- new-brand
npm run ios -- new-brand
```

Do not edit `src/brand/selected.js`, `ios/Brand.xcconfig`, `android/app/brand.properties`, or `android/app/src/branded/`. They are generated from the selected profile and ignored by Git.

## Secrets and Releases

Keep Android keystores, passwords, Apple signing files, certificates, provisioning profiles, and store credentials outside GitHub source files. Android release signing reads the `BRAND_KEYSTORE_FILE`, `BRAND_KEYSTORE_PASSWORD`, `BRAND_KEY_ALIAS`, and `BRAND_KEY_PASSWORD` environment variables. See [the release checklist](docs/release-checklist.md) before publishing.

## Updating the Configuration Contract

When adding or removing a configuration field:

1. Update the example profile in `brands/trip-services/config.json`.
2. Update validation in `scripts/brand.js`.
3. Update the generated consumers.
4. Add or update a test showing the behavior.
5. Update `docs/white-label.md` and this file.
6. Run the full required checks.

Never silently fall back to another company’s legal or payment information.
