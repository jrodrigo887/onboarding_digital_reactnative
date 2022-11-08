import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RNCamera, TakePictureOptions } from 'react-native-camera';
import WebView from 'react-native-webview';


interface NativeActionResponse {
  success: boolean;
  response: string;
}

type ValueMedia = {
    camera: number;
    ballonTitle: string;
    ballonSubtitle: string;
}

interface NativeAction {
  key: string;
  callback: string;
  value: string | ValueMedia;
}

interface WebviewProps {
  navigation?: any;
  route?: any;
  uri?: string;
}

const AppWebView = ({ route, navigation, uri }: WebviewProps) => {
  let webRef = useRef<WebView<{ ref: unknown; onLoadEnd?: () => void; source: { uri: string; }; onMessage: unknown; }> | null>(null);
  let url = useRef(route.params.url)
  // comando obrigatório para comunicação com lite
  const runBeforeFirst = `window.isReactNativeWebView = true`;
  
  // camera refs
  let cameraRef: RNCamera | null;
  const [isCameraActive, setCameraActive] = useState(false);
  const cameraType = useRef(RNCamera.Constants.Type.front)
    
  // comunicação com a webview
  const webViewCallback = (data: string) =>
      `(function() {
        window.reactWebViewCallback(${JSON.stringify(data)});
      })()`;

  function handleNavigate(paramName: string) {
    navigation.navigate(paramName);
  }
  
  const requestCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "App Permissão de Câmera",
        message: "O App precisa de acesso à câmera.",
        buttonNeutral: "Pergunte-me depois",
        buttonNegative: "Cancelar",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Você pode usar a Câmera');
    } else {
      Alert.alert('Permissão de Câmera negada');
    }
  };

  // acessar a câmera
  const getMedia = (params?:  NativeAction): Promise<any> => {
    return new Promise<string>((resolve, reject) => {
      console.log(params);

      if (params) {
        const paramName = params.value as ValueMedia;
        cameraType.current = paramName.camera === 1
        ? RNCamera.Constants.Type.front 
        : RNCamera.Constants.Type.back 
      }

      setCameraActive(true);
    });
  }

  //acessar galeria
  const getGalleryMedia = (params?: NativeAction |  undefined): Promise<string> => {
    // código
    return Promise.resolve('');
  }

  // Ler Qr Code
  const readQrCode = (params?: NativeAction |  undefined): Promise<string> => {
    // código
    return Promise.resolve('');
  }

  // Baixar arquivo para o dispositivo
  const downloadFile = (params?: NativeAction |  undefined): Promise<void> => {
    // código
    return Promise.resolve();
  }

  const actionToFinish = (params?: string | NativeAction |  undefined): Promise<any> => {
    return new Promise((resolve, reject) => {
      handleNavigate('Home')
      resolve('');
    });
  }

  const entryCaptures = async (data: string) => {
    const nativeAction = JSON.parse(data) as NativeAction;
    
    const options: {[key: string]: (params?: NativeAction |  undefined) => Promise<any> } = {
      getMedia,
      getGalleryMedia,
      readQrCode,
      downloadFile,
      actionToFinish
    };
  
    const option = options[nativeAction.key];
    
    if (!option) return false
    
    try {
      await option(nativeAction)

    } catch(e) {
      throw new Error('Error ' + e)
    }
  
  }

  // ======= recursos da câmera =======
  const takePicture = async () => {
      try {
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
          
          const arg: NativeActionResponse = {
            success: true,
            response: data.base64 || ''
          }

          setTimeout(() => {
            webRef.current?.injectJavaScript(webViewCallback(JSON.stringify(arg)))
          }, 500)
        }
      } catch (e) {
        webRef.current?.injectJavaScript(webViewCallback(JSON.stringify({
          success: false,
          response: 'Não ocorreu a captura.'
        })))

      } finally {
        setCameraActive(false)
      }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView 
        ref={f => webRef.current = f}
        // onLoadEnd={() => { requestCameraPermission() }} 
        source={{uri: url.current }} 
        onMessage={(event) => {
          const { nativeEvent } = event;

          entryCaptures(nativeEvent.data);
        }}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
      >

      </WebView>
      { isCameraActive && 
        
        <RNCamera
          ref={ref => { cameraRef = ref; } }
          style={{ zIndex: 20, position: 'relative' }}
          flashMode={RNCamera.Constants.FlashMode.off}
          type={cameraType.current}
        > 
          <TouchableOpacity onPress={() => takePicture() } style={styles.capture}>
            <Text style={{ fontSize: 14 }}> Capture </Text>
          </TouchableOpacity>
        </RNCamera>
        
      }
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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

export default AppWebView;
