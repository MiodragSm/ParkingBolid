# ParkingBolid - Project Plan and Goals

## Overview
ParkingBolid is a React Native mobile application designed to simplify parking payment via SMS in cities across Serbia. The app aims to provide a user-friendly, fast, and reliable experience, with smart features like OCR-based scanning, automatic city detection, easy vehicle management, and a clear UI.

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
- **OCR scanning** for automatic recognition of license plates and parking zone codes.

---

## Core Features
### 1. City Detection and Selection
- **Automatic detection** of the nearest city using GPS on app start.
- **Editable dropdown menu** to manually select or override the city.
- **Persistent city selection** during app session.
- **Local JSON database** of cities with coordinates and parking zones.
- **OCR scanning of parking zone signs** to quickly identify the correct zone code.

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
- **Scan license plates via OCR** to add vehicles quickly without manual typing.
- **Optional nicknames** for vehicles.
- **Persistent storage** using AsyncStorage.
- **Select active vehicle** for payment.
### 4. SMS Payment
- **Generate SMS** with correct number and license plate.
- **Autofill license plate and zone code** using OCR results to reduce manual input.
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

### 7. OCR Scanning
- **Scan license plates and parking zone signs** using the device camera.
- **Automatic detection, extraction, and validation** of text.
- **Autofill** license plate and zone fields to minimize manual input.
- **Manual correction** option if recognition is uncertain.

---

## Technical Stack
- **React Native** (JavaScript, ES6+)
- **React Navigation** for screen management
- **React Context API** for global state
- **AsyncStorage** for persistent data
- **react-native-geolocation-service** for GPS
- **react-native-vector-icons** for icons
- **Local JSON files** for parking zones data
- **react-native-vision-camera** for camera access and live preview
- **Google ML Kit** for on-device OCR and object detection
- **TensorFlow Lite** for custom detection models
- **Custom image preprocessing** with JavaScript and native modules

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
- **Enhanced OCR accuracy** and support for additional languages/scripts.

---

## OCR & Object Detection Integration

- Streamline parking payment by scanning license plates and parking zone signs.
- Minimize manual input with automated detection, extraction, and validation.

### Key Features

- **Camera Capture with User Guidance**
  - Overlay guide to align plates/signs.
  - Tap-to-focus, zoom, torch control.

- **Automated Image Preprocessing**
  - Grayscale, contrast enhancement, adaptive thresholding.
  - Noise reduction, optional perspective correction.

- **On-Device Object Detection**
  - Detect license plates and parking signs.
  - Crop images to relevant regions for focused OCR.

- **Targeted OCR**
  - Extract text from detected regions.
  - Support Serbian characters (Š, Đ, Č, Ć, Ž).

- **Post-processing & Validation**
  - Clean and validate license plates with regex.
  - Extract and validate parking zone codes.
  - Manual correction fallback.

- **User Interface Integration**
  - Overlay detection boxes (optional).
  - Autofill fields with edit/confirm options.
  - Suggest multiple candidates.

- **Privacy & Performance**
  - All processing on-device.
  - Offline, real-time operation.

- **Testing**
  - Diverse lighting, angles, designs.
  - Optimize speed and accuracy.

### OCR Pipeline

**Capture → Preprocess → Detect → OCR → Validate → Autofill**

---

## Summary
ParkingBolid aims to be a lightweight, user-friendly app that streamlines SMS parking payments across Serbia, with smart defaults, persistent user data, and a clean, dark-themed UI. The architecture supports easy future expansion and maintainability.