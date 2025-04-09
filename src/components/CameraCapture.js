import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import torchIcon from '../assets/torch.png';
import captureIcon from '../assets/Image-Capture-icon.png';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const CameraCapture = ({ onCapture }) => {
  const [previewSize, setPreviewSize] = React.useState(null);
  const [focusPoint, setFocusPoint] = React.useState(undefined);
  const [isTorchOn, setIsTorchOn] = React.useState(false);
  const [focusIndicator, setFocusIndicator] = React.useState(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const minZoom = React.useMemo(() => device?.minZoom ?? 1, [device]);
  const maxZoom = React.useMemo(() => device?.maxZoom ?? 1, [device]);

  const [zoom, setZoom] = React.useState(minZoom);

  const torch = React.useMemo(() => (isTorchOn ? 'on' : 'off'), [isTorchOn]);


  const handleZoomChange = (value) => {
    const clamped = Math.max(minZoom, Math.min(value, maxZoom));
    setZoom(clamped);
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then(granted => {
        if (!granted) {
          console.log('Camera permission denied');
          // Optionally guide user to settings: Linking.openSettings();
        }
      });
    }
  }, [hasPermission, requestPermission]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto();
      onCapture(photo.path);
    }
  };

  const cameraRef = React.useRef(null);

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Potrebna je dozvola za kameru.</Text>
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.center}>
        <Text style={styles.text}>Kamera nije pronađena.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={styles.preview}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setPreviewSize({ width, height });
        }}
      >
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          photo={true}
          zoom={zoom}
          torch={torch}
          enableZoomGesture={true}
          focusPoint={focusPoint}
        />
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={(event) => {
              const { locationX, locationY } = event.nativeEvent;
              if (!previewSize) {return;}
              const x = locationX / previewSize.width;
              const y = locationY / previewSize.height;
              setFocusPoint({ x, y });
              setFocusIndicator({ x: locationX, y: locationY });
              setTimeout(() => setFocusIndicator(null), 1000);
            }}
            pointerEvents="auto"
          />
        </View>
        {focusIndicator && (
          <View
            style={{
              position: 'absolute',
              left: focusIndicator.x - 25,
              top: focusIndicator.y - 25,
              width: 50,
              height: 50,
              borderWidth: 2,
              borderColor: 'yellow',
              borderRadius: 25,
            }}
            pointerEvents="none"
          />
        )}
      </View>
      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
        <Image source={captureIcon} style={styles.captureIcon} />
      </TouchableOpacity>
      {device?.hasTorch && (
        <TouchableOpacity
          style={styles.torchButton}
          onPress={() => setIsTorchOn(!isTorchOn)}
        >
          <Image source={torchIcon} style={styles.icon} />
        </TouchableOpacity>
      )}

      <View style={styles.zoomSliderContainer}>
        <Text style={styles.buttonText}>Zum: {zoom.toFixed(1)}x</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={minZoom}
          maximumValue={maxZoom}
          step={0.1}
          value={zoom}
          onValueChange={handleZoomChange}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#AAAAAA"
          thumbTintColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  preview: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
  },
  captureButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  torchButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 25,
  },
  zoomSliderContainer: {
    position: 'absolute',
    bottom: 10,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureIcon: {
    width: 45,
    height: 45,
  },
});

export default CameraCapture;

