# Architecture

## Core Principle

The repository contains one product implementation and separate data profiles for branded apps. A brand is selected at build time. It is not selected by the end user at runtime.

```text
brands/<id>/config.json + assets
              |
       scripts/brand.js
              |
  generated selected brand and native resources
              |
     shared React Native application
```

## Shared Application

Shared features live under `src/`. Invoice calculations are kept in `src/services/invoices/utils.js`, form rules in the invoice validation schema, and presentation in the form, preview, and PDF template modules. These modules receive brand data through `src/brand` and must not import a specific customer profile directly.

The app theme is built from semantic tokens such as `primary`, `surface`, `text`, `textMuted`, `border`, and `error`. Every profile supplies light and dark values for those tokens. Components should consume semantic tokens through the React Native Paper theme instead of literal colors.

Invoice rendering is separate from mobile screen rendering. The PDF uses the selected brand’s invoice colors, company details, copy, logo, locale, and currency. Mobile preview uses the same profile and formats money with the configured locale and ISO currency code.

## Brand Profiles

Each profile contains:

- App identity: display name, Android application ID, iOS bundle ID
- Company identity: legal name, registration number, address, tagline, contact details
- Payment details: a labeled list that supports sort codes, account numbers, IBAN, BIC, or other formats
- Invoice settings: locale, currency, tax label, title, notes, payment copy, footer copy, print colors
- Theme settings: complete light and dark semantic palettes
- Assets: home logo, background, app icon, invoice logo, and launch image

`scripts/brand.js` validates required values, colors, identifiers, assets, image dimensions, currency support, and duplicate application IDs. It then generates the selected JavaScript profile, Android resources, and iOS assets/build settings.

## Branching

Shared work is integrated through `develop` and promoted to `main` for releases. Every client white-label branch uses `whitelabel-<brand-name>`, with lowercase hyphenated words. For example, `Acme Electrical Services` becomes `whitelabel-acme-electrical`. Create it from the current `develop` branch, keep the client profile under `brands/<id>/`, and open its completed PR back into `develop`. Shared feature work should continue through normal feature branches and PRs into `develop` so it remains available to every brand.

## Generated Files

Generated files are ignored because they depend on the selected build. They must be recreated by `npm run brand:prepare -- <id>` or the brand-aware run commands. Never commit them and never make source changes that depend on one generated profile being present in the repository.

## Native Builds

Android uses the `branded` flavor and receives the application ID from `android/app/brand.properties`. iOS receives the bundle ID, display name, icon set, and deployment target through `ios/Brand.xcconfig`. iOS currently targets version 15 or newer because the dependency set cannot be built by the current Xcode toolchain for iOS 13.4.

Development builds use the checked-in debug keystore. Release builds require environment-provided signing credentials. Store identifiers, signing credentials, and upload tokens are operational deployment data and do not belong in brand JSON or Git.

## Extension Decisions

Add configuration when the difference is data: wording, colors, assets, company details, currency, invoice labels, or payment fields. Add shared code when the behavior is common to all brands. For a genuinely different workflow, introduce a small capability or strategy selected by validated configuration before creating duplicated brand code.

When a new field is added to the profile, update the example profile, validator, generated consumers, tests, and documentation in the same PR.
