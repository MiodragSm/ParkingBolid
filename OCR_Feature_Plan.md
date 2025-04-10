# Optimized OCR & Object Detection Integration Plan for Serbian Parking Payment App

This document outlines the planned features and technical approach for integrating advanced OCR and object detection into the parking payment app, optimized for Serbian license plates and parking zone signs.

---

## Overview

The goal is to streamline the parking payment process by enabling users to scan license plates and parking zone signs using their device camera. The app will automatically detect relevant regions, extract text, validate it, and populate payment fields, minimizing manual input.

---

## Feature Breakdown

### 1. **Camera Capture with User Guidance**

- Utilize the device camera to capture high-resolution images.
- Provide an overlay guide (rectangle/frame) to help users align license plates or parking signs.
- Support tap-to-focus, zoom, and torch control for better image quality.

---

### 2. **Automated Image Preprocessing**

- Enhance captured images **before** detection and OCR to improve accuracy:
  - Convert to **grayscale**.
  - **Increase contrast**.
  - Apply **adaptive thresholding** (binarization) to handle varying lighting.
  - **Reduce noise** using filters.
  - Optionally, perform **perspective correction**.
- This step ensures cleaner input for detection and OCR.

---

### 3. **On-Device Object Detection**

- Use an on-device ML model (ML Kit or custom TFLite) to detect:
  - **License plates**
  - **Parking zone signs**
- The model returns **bounding boxes** for relevant regions.
- Crop the preprocessed image to these regions for focused OCR.
- Benefits:
  - Ignores irrelevant background.
  - Improves speed and accuracy.

---

### 4. **Targeted OCR**

- Run OCR **only** on detected regions.
- Use on-device OCR (ML Kit Text Recognition).
- Configure for **Latin script** with Serbian character support (Š, Đ, Č, Ć, Ž).
- Extract raw text from each region.

---

### 5. **Post-processing & Validation**

- **License Plates:**
  - Clean OCR output (remove spaces/symbols).
  - Validate with regex: `^[A-ZŠĐČĆŽ]{1,2}-?\d{2,4}-?[A-ZŠĐČĆŽ]{1,2}$`.
  - Correct common OCR errors (e.g., '0' ↔ 'O', '1' ↔ 'I').
- **Parking Zones:**
  - Extract 3-4 digit SMS codes (often starting with '9').
  - Validate against known formats or city database.
- **Fallback:** Allow manual correction if validation fails.

---

### 6. **User Interface Integration**

- Overlay detected bounding boxes on camera preview (optional).
- Display recognized text with options to **edit or confirm**.
- Autofill license plate and zone fields.
- Suggest multiple candidates if detected.
- Provide clear feedback during scanning and processing.

---

### 7. **Privacy & Performance**

- All processing is performed **on-device**:
  - Ensures user privacy.
  - Enables offline operation.
  - Provides real-time performance.

---

### 8. **Testing**

- Test under diverse real-world conditions:
  - Different lighting.
  - Various angles.
  - Multiple plate/sign designs.
- Optimize for speed and accuracy.

---

## Summary

This multi-step pipeline:

**Capture → Preprocess → Detect → OCR → Validate → Autofill**

will significantly improve recognition accuracy, speed, and user experience, making parking payments faster and more reliable.