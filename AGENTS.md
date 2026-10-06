# Repository Instructions

These instructions apply to automated coding agents and human contributors.

## Mission

Maintain one shared React Native invoice application that can produce multiple branded apps from validated profiles under `brands/`.

## Mandatory Rules

- Read `CONTRIBUTING.md`, `docs/architecture.md`, and `docs/white-label.md` before changing architecture, branding, invoice output, or native build files.
- Keep brand-specific data and assets under `brands/<brand-id>/`.
- Keep shared behavior in `src/`, `scripts/`, or the native build infrastructure.
- Do not hard-code a company name, logo, bank detail, currency symbol, currency code, invoice copy, or brand color in shared feature code.
- Use semantic theme colors so both light and dark mode remain configurable.
- Do not edit generated files: `src/brand/selected.js`, `ios/Brand.xcconfig`, `android/app/brand.properties`, and `android/app/src/branded/`.
- Validate every brand after configuration changes.
- Preserve unrelated user changes in the working tree.
- Do not merge pull requests. Leave changes in the requested branch and report the PR URL.

## Workflow

1. Inspect the existing code and tests before editing.
2. Identify whether the request is shared behavior or brand configuration.
3. Make the smallest change that matches existing patterns.
4. Add focused tests for changed contracts and user-visible behavior.
5. Run `npm run brand:validate-all`, `npm run lint`, and `npm test -- --runInBand`.
6. Run Android and iOS checks when native code, assets, themes, or build configuration changed.
7. Update the relevant documentation when a workflow, configuration field, command, or branch rule changes.

## Review Focus

Check for brand leakage in screens, invoice preview, generated HTML/PDF, app name, icons, package IDs, permissions, and native launch assets. Check that invoice values are escaped, money uses the selected locale and currency, and dark mode remains readable.
