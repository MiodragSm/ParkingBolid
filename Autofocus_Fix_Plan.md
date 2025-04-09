# Autofocus Tap-to-Focus Fix Plan

## Problem
The current autofocus tap implementation in `CameraCapture.js` causes a runtime error:
```
Cannot read property 'width' of undefined
```
because it incorrectly tries to destructure `width` and `height` from the tap event, which does not contain layout information.

---

## Solution Overview
Capture the camera preview's dimensions during layout and use these stored dimensions to normalize tap coordinates for autofocus.

---

## Implementation Steps

### 1. Add preview size state
Add a new state variable:
```js
const [previewSize, setPreviewSize] = React.useState(null);
```

---

### 2. Capture preview size on layout
Modify the camera preview container:
```jsx
<View
  style={styles.preview}
  onLayout={(e) => {
    const { width, height } = e.nativeEvent.layout;
    setPreviewSize({ width, height });
  }}
>
```

---

### 3. Update tap handler
Replace the current tap handler with:
```js
onPress={(event) => {
  const { locationX, locationY } = event.nativeEvent;
  if (!previewSize) return; // Defensive: skip if size not yet measured
  const x = locationX / previewSize.width;
  const y = locationY / previewSize.height;
  setFocusPoint({ x, y });
}}
```

---

### 4. Remove incorrect destructuring
Remove this line:
```js
const { width, height } = event.nativeEvent.source; // REMOVE
```

---

## Defensive Considerations
- Skip autofocus if preview size is not yet available.
- Avoid division by zero.
- Optionally, clamp normalized coordinates between 0 and 1.

---

## Flow Diagram

```mermaid
flowchart TD
    A[User taps on preview] --> B{previewSize available?}
    B -- No --> C[Ignore tap or show error]
    B -- Yes --> D[Get tap coordinates (locationX, locationY)]
    D --> E[Normalize: x = locationX / width, y = locationY / height]
    E --> F[Set focusPoint {x, y}]
    F --> G[Camera updates focus]
```

---

## Summary
- Capture preview size once on layout.
- Use stored size to normalize tap coordinates.
- Fixes runtime error and enables reliable tap-to-focus.

---

## Next Step
Switch to **code mode** and implement these changes in `src/components/CameraCapture.js`.