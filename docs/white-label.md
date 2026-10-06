# White Label Guide

The application has one shared invoice implementation. A brand profile supplies its app identity, business details, assets, invoice copy, currency, and light/dark colors. The selected profile is compiled into the app; users cannot change brands at runtime.

For repository contribution rules, shared-versus-brand ownership, and release responsibilities, read [CONTRIBUTING.md](../CONTRIBUTING.md), [the architecture guide](architecture.md), and [the release checklist](release-checklist.md).

Use the [client intake form](client-brand-intake.md) to collect the information and approvals required before creating a new brand profile.

## Create a Brand

1. Copy `brands/trip-services/` to `brands/<id>/`. Use a lowercase ID with hyphens.
2. Replace every value in `config.json`. Set unique `androidApplicationId` and `iosBundleId`; published app IDs cannot be changed without creating a different store app.
3. Replace all five assets. A square icon with important artwork away from its edges is recommended; source dimensions must be at least 1024x1024. `launchImage` may be a separate, simpler logo. Use accurate legal, contact, tax, and bank details. An empty `company.address` omits the address from the PDF.
4. Set light and dark semantic colors. Check text contrast, calendar readability, and the PDF. `invoice.colors` applies to the printed document, independent of the device color scheme.
5. Run `npm run brand:validate -- <id>` and build both platforms.

The banking `details` array supports different banking systems. Each entry has a `label` and `value`, for example sort code/account number or IBAN/BIC. `invoice.currency` is an ISO 4217 code and `invoice.locale` determines its display format.

## Build and Test

```bash
npm install
npm run brand:validate -- <id>
npm run start -- <id>
npm run android -- <id>
npm run ios -- <id>
npm run android:apk -- <id>
npm run lint
BRAND=<id> npm test -- --runInBand
```

Run Metro and the native build with the same ID. Stop Metro before switching brands in the same checkout, then restart it with the new ID and `--reset-cache`. A separate checkout or Git worktree is required for simultaneous builds of different brands. The preparation step writes ignored generated files; it does not modify shared source or committed native assets. Android uses a `branded` flavor. Use `npm run android:apk -- <id>` for a standalone debug APK because it prepares the requested profile in the same command. A direct Gradle build uses whichever profile was prepared most recently. `npm test` defaults to Trip Services unless `BRAND=<id>` is provided. iOS CLI builds pass `ios/Brand.xcconfig`; when building directly in Xcode, supply that file as an `-xcconfig` build argument or use the CLI. Install pods before the first iOS build.

The generated iOS build config targets iOS 15 or newer because the current Xcode toolchain no longer builds this dependency set for iOS 13.4.

Before release, inspect the app name and icon on device, home imagery, both theme modes, invoice preview, PDF logo, address, registration number, banking details, and currency. Confirm the app ID and signing configuration for that brand. Android release signing reads `BRAND_KEYSTORE_FILE`, `BRAND_KEYSTORE_PASSWORD`, `BRAND_KEY_ALIAS`, and `BRAND_KEY_PASSWORD` from the build environment; keep those credentials outside Git. iOS signing is configured through Xcode or CI credentials.

Pull requests validate every profile and build Android and iOS simulator variants for every brand directory. Release signing and store uploads are separate steps.

## Branches

Shared feature PRs target `develop`; validated releases are promoted to `main`. Brand profiles live under `brands/<id>/` in the same repository, so a shared feature needs one merge to reach every brand. Release each brand from a known `main` commit and record the commit and version in its release tag.

For every client white-label, create a branch named `whitelabel-<brand-name>` from the current `develop` branch. Convert the client brand name to lowercase, replace spaces and punctuation with hyphens, and keep it short. For example, `Acme Electrical Services` becomes `whitelabel-acme-electrical`. Keep client configuration and assets in its `brands/<id>/` directory, then open a PR from the white-label branch into `develop` after client approval. Merge upstream shared updates into the white-label branch when needed for testing. Changes to shared screens, invoice logic, or native infrastructure should return through a PR to `develop` so other brands can use them. Avoid committing generated output to white-label branches.
