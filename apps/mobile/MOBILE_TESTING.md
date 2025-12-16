# Mobile App Testing Guide

## Prerequisites

1. **Node.js**: Version 18+ installed
2. **Expo CLI**: Install globally
   ```bash
   npm install -g expo-cli
   ```
3. **Expo Go App**: Install on your phone
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

## Setup Steps

### 1. Install Dependencies

```bash
cd apps/mobile
npm install
```

### 2. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
API_URL=https://management-user-ai-production.up.railway.app
```

### 3. Start Development Server

```bash
# From apps/mobile directory
npm start
```

This will:
- Start the Expo development server
- Display a QR code in the terminal
- Open Expo DevTools in your browser

## Testing on Physical Device

### iOS (iPhone/iPad)

1. Install **Expo Go** from App Store
2. Open Camera app
3. Scan the QR code from terminal
4. App will open in Expo Go

### Android

1. Install **Expo Go** from Play Store
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from terminal

## Testing on Emulator/Simulator

### iOS Simulator (Mac only)

```bash
# Press 'i' in the terminal after starting
npm start
# Then press 'i'
```

Or install Xcode and iOS Simulator first:
```bash
xcode-select --install
```

### Android Emulator

1. Install Android Studio
2. Set up Android Virtual Device (AVD)
3. Start emulator
4. In terminal, press 'a' after running `npm start`

## Test Scenarios

### 1. Login Flow

**Test Case**: Valid Login
- Email: `admin@example.com`
- Password: `admin123`
- Expected: Navigate to Dashboard

**Test Case**: Invalid Login
- Email: `wrong@example.com`
- Password: `wrong`
- Expected: Error message displayed

### 2. Dashboard

**Verify**:
- Stats cards display correct counts
- Recent activity shows latest logs
- All navigation buttons work
- Pull to refresh updates data

### 3. Users Screen

**Test**:
- User list loads
- Search functionality works
- Pagination displays if > 10 users
- Pull to refresh updates list
- Click user to see details

### 4. Roles Screen

**Test**:
- Roles list loads
- System badge shows for system roles
- Permission count displays correctly
- Pull to refresh works

### 5. Profile Screen

**Test**:
- Current user info displays
- Edit profile works
- Update succeeds
- Logout button works

### 6. Activity Logs

**Test**:
- Logs list loads
- Shows action, user, timestamp
- Pagination works
- Pull to refresh updates

## Common Issues

### Port Already in Use

```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Clear Cache

```bash
# Clear Expo cache
expo start -c
```

### Can't Connect to API

1. Check `.env` has correct API_URL
2. Ensure API is deployed and running
3. Restart Expo server after changing `.env`

### Network Request Failed

- Ensure phone and computer are on **same WiFi**
- Check firewall isn't blocking connections
- Try using tunnel mode: `expo start --tunnel`

## Development Tips

### Hot Reload

- Save any file to trigger hot reload
- Shake device to open developer menu
- Enable "Fast Refresh" for instant updates

### Debugging

**In Expo Go**:
- Shake device → "Debug Remote JS"
- Opens Chrome DevTools
- Use console.log() for debugging

**React DevTools**:
```bash
npm install -g react-devtools
react-devtools
```

### Performance

- Use React.memo() for heavy components
- Implement FlatList for long lists
- Avoid inline styles and functions

## Production Build

### Build APK (Android)

```bash
expo build:android
```

### Build IPA (iOS)

```bash
expo build:ios
```

Requires Apple Developer account ($99/year)

## Troubleshooting

### Expo Go Connection Issues

1. **Tunnel Mode** (slower but more reliable):
   ```bash
   expo start --tunnel
   ```

2. **LAN Mode** (faster, requires same network):
   ```bash
   expo start --lan
   ```

3. **Local Mode** (localhost only):
   ```bash
   expo start --localhost
   ```

### Build Errors

```bash
# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear watchman cache (Mac)
watchman watch-del-all
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo GitHub](https://github.com/expo/expo)

## Support

Issues? Check:
1. Expo status: https://status.expo.dev/
2. Stack Overflow: Tag `expo` or `react-native`
3. Expo Forums: https://forums.expo.dev/
