# Trip Electric Services - Invoice Generator

A React Native mobile application for generating, printing, and sharing professional PDF invoices.

## Features

- Create detailed invoices with multiple line items
- Generate professional PDF documents
- Print invoices directly from the app
- Share invoices via system share dialog
- Customizable invoice options (company details, banking info, special instructions)

## Getting Started

### Prerequisites

Install the React Native CLI development environment for your target platform:

- Node.js 18 or newer
- npm
- Watchman on macOS
- Android Studio with Android SDK 34 and an Android emulator or device
- Xcode and CocoaPods for iOS builds on macOS
- Ruby 2.6.10 or newer for CocoaPods tooling

Follow the official [React Native environment setup](https://reactnative.dev/docs/environment-setup) guide and choose **React Native CLI**, not Expo.

### Installation

```bash
# Clone the repository
git clone git@github.com:khalidsohaibrana/tripServices.git
cd tripServices

# Install JavaScript dependencies
npm install
```

For iOS, install CocoaPods dependencies after `npm install`:

```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

If you do not use Bundler, run `pod install` from the `ios` folder instead.

### Running the App

Start Metro in one terminal:

```bash
npm start
```

Then run the app from another terminal.

Android:

```bash
npm run android
```

iOS:

```bash
npm run ios
```

Make sure an Android emulator is running before launching Android. For iOS, open Xcode first if you need to choose a simulator, signing team, or device.

### Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- __tests__/invoiceUtils.test.js
```

## Project Structure

```
src/
├── components/       # UI components
│   └── invoices/    # Invoice-specific components
├── screens/         # Screen containers
├── services/        # Business logic
│   └── invoices/   # Invoice calculations, PDF generation
├── config/          # App configuration
├── hooks/           # Custom React hooks
└── theme/           # Styling and assets
```

## Key Files

- **Company Details**: `src/config/company.js`
- **Invoice Logic**: `src/services/invoices/`
- **Form Validation**: `src/components/invoices/InvoiceForm/validationSchema.js`
- **PDF Template**: `src/services/invoices/template.js`

## Common Tasks

### Update Company Information

Edit `src/config/company.js`:
```javascript
export const COMPANY_INFO = {
  name: 'Your Company Name',
  registrationNumber: '12345678',
  contact: { email, phone, website },
  banking: { sortCode, accountNumber },
};
```

### Modify Invoice Calculations

Edit `src/services/invoices/utils.js` for calculation logic.

### Customize Invoice Design

Edit `src/services/invoices/template.js` for HTML/CSS changes.

### Update the app logo

The app logo is used in three places: **home screen**, **app icon (launcher)**, and **invoice PDFs**.

1. **Replace the logo image**  
   Save your logo (PNG or JPEG, 1024×1024 or larger recommended) as:
   ```
   src/theme/assets/TripServicesLogo.jpeg
   ```

2. **Regenerate app icons (Android + iOS)**  
   This updates the launcher icon on devices and in the app store assets:
   ```bash
   npm run generate-icons
   ```

3. **Update the invoice PDF logo**  
   This updates the company logo shown on generated invoices:
   ```bash
   npm run update-invoice-logo
   ```

The home screen uses the same file and scales it responsively; no extra step needed.

## Tech Stack

- React Native 0.75.3
- React Navigation
- React Native Paper (UI)
- Formik + Yup (Forms & Validation)
- react-native-html-to-pdf (PDF Generation)
- react-native-share (Sharing)

## Troubleshooting

### Build Issues

```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Reinstall iOS pods
cd ios && bundle exec pod install && cd ..

# Reset Metro cache
npm start -- --reset-cache
```

If Android cannot find the SDK, confirm `ANDROID_HOME` points to your Android SDK folder and that SDK 34 is installed in Android Studio.

### Permission Issues (Android)

The app handles storage permissions automatically based on Android API level.

## License

Private - Trip Electric Services LTD

## Version

0.0.1
