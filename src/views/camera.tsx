import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera, TakePictureOptions } from 'react-native-camera';

export default function Camera() {
    let cameraRef: RNCamera | null;

    const takePicture = async () => {
        if (cameraRef) {
          const options: TakePictureOptions = { 
            quality: 0.5, 
            base64: true, 
            fixOrientation: true, 
            forceUpOrientation: true,
            imageType: "jpeg",
            orientation: 'portrait' 
          };
          const data = await cameraRef.takePictureAsync(options);
          console.log(data.uri);
        }
    };
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => { cameraRef = ref; } }
          style={{ flex: 1 }}
          flashMode={RNCamera.Constants.FlashMode.off}
          type={RNCamera.Constants.Type.back}
          
        >

        <TouchableOpacity onPress={() => takePicture() } style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Capture </Text>
          </TouchableOpacity>
        </RNCamera>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
