# User Management Mobile App

React Native mobile application built with Expo for the User Management System.

## Features

- 🔐 Authentication (Login/Logout)
- 👥 View Users List with Search & Pagination
- 👤 User Profile Management
- 📋 Activity Logs Viewer
- 📱 Cross-platform (iOS & Android)

## Tech Stack

- **React Native** with **Expo**
- **TypeScript**
- **React Navigation** for routing
- **Axios** for API calls
- **Expo Secure Store** for secure token storage

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (for testing)

## Installation

1. Navigate to the mobile directory:
   ```bash
   cd apps/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update the API URL in `.env`:
   ```
   EXPO_PUBLIC_API_URL=https://your-api-url.com
   ```

## Running the App

### Development Mode

```bash
npm start
```

This will open the Expo Developer Tools. You can:
- Scan the QR code with Expo Go app (iOS/Android)
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (Mac only)

### Run on specific platforms:

```bash
npm run android  # Android
npm run ios      # iOS (Mac only)
npm run web      # Web browser
```

## Project Structure

```
apps/mobile/
├── src/
│   ├── context/           # React Context (Auth)
│   ├── screens/           # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── UsersScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ActivityLogsScreen.tsx
│   ├── services/          # API services
│   │   ├── api.ts         # Axios instance
│   │   ├── auth.ts        # Auth service
│   │   └── users.ts       # Users service
│   └── types/             # TypeScript types
├── App.tsx                # Main app component
└── package.json
```

## API Integration

The app connects to the backend API. Make sure:
1. Backend is running and accessible
2. `EXPO_PUBLIC_API_URL` is set correctly
3. CORS is enabled on the backend for mobile requests

## Default Credentials

Use the same credentials as the web app:
- Email: `admin@example.com`
- Password: `admin123`

## Building for Production

### Android APK:

```bash
expo build:android
```

### iOS IPA:

```bash
expo build:ios
```

For more details, see [Expo Build Documentation](https://docs.expo.dev/build/introduction/).

## Testing

Test the app using Expo Go:
1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Run `npm start`
3. Scan the QR code with your phone
4. The app will load on your device

## Troubleshooting

### Can't connect to API
- Check if backend is running
- Verify `EXPO_PUBLIC_API_URL` is correct
- For localhost, use your computer's IP address instead of `localhost`

### Expo Go not connecting
- Ensure phone and computer are on the same network
- Try tunnel mode: `expo start --tunnel`

## Features Todo

- [ ] Push notifications
- [ ] Offline mode
- [ ] Biometric authentication
- [ ] Dark mode
- [ ] User creation/editing in app

## License

MIT
