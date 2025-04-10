# ParkingBolid - Project Plan and Goals

## Overview
ParkingBolid is a React Native mobile application designed to simplify parking payment via SMS in cities across Serbia. The app aims to provide a user-friendly, fast, and reliable experience, with automatic city detection, easy vehicle management, and clear UI.

---

## General Building Goals
- **Cross-platform mobile app** (Android and iOS) using React Native.
- **Simple, intuitive UI** inspired by existing parking apps like "Parking Manijak".
- **Dark mode** as default theme.
- **Modular, maintainable codebase** with clear separation of concerns.
- **Persistent storage** for user data (vehicles, preferences).
- **Geolocation-based city detection** with manual override.
- **Support for multiple cities and parking zones** in Serbia.
- **SMS payment integration** using device's default SMS app.
- **Offline-first**: all zone data stored locally in JSON.
- **Extensible** for future features (e.g., online payments, notifications).

---

## Core Features

### 1. City Detection and Selection
- **Automatic detection** of the nearest city using GPS on app start.
- **Editable dropdown menu** to manually select or override the city.
- **Persistent city selection** during app session.
- **Local JSON database** of cities with coordinates and parking zones.

### 2. Parking Zones
- Display **zones for the selected city** with:
  - Zone name and color
  - SMS number
  - Time limits
  - Price
  - Working hours
- **Tap to select** a parking zone.

### 3. Vehicle Management
- **Add, edit, delete** multiple license plates.
- **Optional nicknames** for vehicles.
- **Persistent storage** using AsyncStorage.
- **Select active vehicle** for payment.

### 4. SMS Payment
- **Generate SMS** with correct number and license plate.
- **Open default SMS app** with pre-filled message.
- **User confirms and sends** the SMS manually.

### 5. Navigation and Screens
- **Home Screen**: city dropdown, zones list, vehicle selector, pay button.
- **Settings Screen**: manage vehicles, clear all, help link.
- **Help Screen**: instructions and app info.
- **Optional future screens**: payment history, notifications.

### 6. UI/UX
- **Dark mode** by default.
- **Responsive layout** for various screen sizes.
- **Consistent styling** with React Native Elements and custom styles.
- **Icons** for zones, settings, vehicles.
- **Loading indicators** during geolocation.

---

## Technical Stack
- **React Native** (JavaScript, ES6+)
- **React Navigation** for screen management
- **React Context API** for global state
- **AsyncStorage** for persistent data
- **react-native-geolocation-service** for GPS
- **react-native-vector-icons** for icons
- **Local JSON files** for parking zones data

---

## Data Structure
- **Cities JSON** with:
  - `grad`: city name
  - `registracijaPrefix`
  - `lat`, `lng`: coordinates
  - `zone`: array of zones
- **Zone** with:
  - `id`
  - `naziv`, `skraceniNaziv`
  - `smsBroj`
  - `maxVreme`
  - `cena`
  - `vremeOgranicenja`

---

## Future Enhancements
- **Reverse geocoding** for more precise city detection.
- **Online data sync** for parking zones.
- **Push notifications** for parking expiration.
- **Payment history** and receipts.
- **Multi-language support**.
- **Light/dark mode toggle**.
- **Accessibility improvements**.

---

## Summary
ParkingBolid aims to be a lightweight, user-friendly app that streamlines SMS parking payments across Serbia, with smart defaults, persistent user data, and a clean, dark-themed UI. The architecture supports easy future expansion and maintainability.