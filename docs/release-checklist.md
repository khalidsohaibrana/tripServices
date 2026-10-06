# Release Checklist

Use this checklist for each brand release. Record the brand ID, source commit, version, and build artifact outside the repository’s source files.

## Configuration

- [ ] Brand configuration validates with `npm run brand:validate -- <id>`.
- [ ] Android and iOS application IDs are unique and approved for the intended store apps.
- [ ] Legal name, registration number, address, contact details, tax label, and payment details are correct.
- [ ] Currency and locale are correct for the customer.
- [ ] Logo, icon, background, invoice logo, and launch image are the approved assets.
- [ ] No credentials, certificates, private keys, or store tokens are in the profile or repository.

## Product Verification

- [ ] App name and launcher icon are correct on a device or simulator.
- [ ] Home screen uses the correct logo and background.
- [ ] Light mode is readable.
- [ ] Dark mode is readable, including the calendar picker, inputs, buttons, and invoice preview.
- [ ] Required form validation prevents incomplete invoices.
- [ ] Invoice preview shows the correct company details and currency.
- [ ] Generated PDF shows the correct logo, address, bank details, tax label, totals, and currency formatting.
- [ ] PDF and preview escape customer-entered text correctly.
- [ ] Print and share workflows complete successfully.

## Automated Checks

- [ ] `npm run brand:validate-all` passes.
- [ ] `npm run lint` passes.
- [ ] `npm test -- --runInBand` passes.
- [ ] Android branded debug build passes.
- [ ] iOS simulator build passes.
- [ ] CI checks pass for every brand profile.

## Signing and Distribution

- [ ] Android release signing uses the intended production keystore through protected environment variables.
- [ ] iOS signing team, certificates, provisioning, and bundle ID are correct.
- [ ] Version and build numbers are incremented.
- [ ] Release artifact was installed and smoke-tested.
- [ ] Store screenshots, description, privacy information, and support details match the brand.
- [ ] The release commit and artifact location are recorded.
