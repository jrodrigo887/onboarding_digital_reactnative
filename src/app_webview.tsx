import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import WebView from 'react-native-webview';

// estrutura para retorno das "capturas" se necessário
interface NativeActionResponse {
  success: boolean;
  response: string;
}

type Values = { [key: string]: any };

type ReturnValueActionFinish = {
  typeOfFinishing: string; // tipo de fechamento "CloseWindow" ou "RedirectToLink"
  linkForRedirect: string; // acompanha url caso haja redirecionamento configurado 
}

/**
 * @interface
 * {key} contém nome da função  
 * {callback} deve conter o nome da função acima para possíveis retorno de dados na webview, por equanto sem uso.  
 * {value} dados diversos recebido do Lite.
 */
interface NativeAction {
  key: string;
  callback: string;
  value: Values | ReturnValueActionFinish | string | null;
}

interface WebviewProps {
  navigation?: any;
  route?: any;
  uri?: string;
}

const AppWebView = ({ route, navigation, uri }: WebviewProps) => {
  let webRef = useRef<WebView<{ ref: unknown; onLoadEnd?: () => void; source: { uri: string; }; onMessage: unknown; }> | null>(null);
  let url = useRef(route.params.url)

  // é necessário injetar essa variável de forma global para identificação dentro da webview
  const runBeforeFirst = `window.isReactNativeWebView = true`;

   // passar retorno das capturas entre outras coisas pelo callback
   const webViewCallback = (data: string) =>
   `(function() {
     window.reactWebViewCallback(${JSON.stringify(data)});
   })()`;

  
  function handlerNavigate(paramName: string) {
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
      // Alert.alert('Você pode usar a Câmera');
    } else {
      // Alert.alert('Permissão de Câmera negada');
    }
  };

  // função para finalizar atendimento. ()
  const actionToFinish = (params: NativeAction): Promise<any> => {
    return new Promise((resolve, reject) => {

      // Estou recebendo do params
      const resultado: NativeAction = {
        key: params.key, // "actionToFinish",
        callback: params.callback, // " window.reactWebViewCallback"
        value: params.value as ReturnValueActionFinish
      }

      // simulando fechamento do atendimento (navegue para tela Home)
      handlerNavigate('Home')

      // caso necessite retorna algo para App do Onboarding Digital
      const response: NativeActionResponse = {
        success: true,
        response: "Ok!!!"
      }
      
      webViewCallback(JSON.stringify(response))

      // resolve('');
    });
  }

  // entrada para comunicação entre webview e o nativo
  const entryCaptures = async (data: string) => {
    const nativeAction = JSON.parse(data) as NativeAction;
    
    const options: {[key: string]: (params: NativeAction) => Promise<any> | void } = {
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

  return (
    <View style={{ flex: 1, zIndex: 0, position: 'relative' }}>
      <WebView 
        ref={f => webRef.current = f}
        onLoadEnd={() => { requestCameraPermission() }} 
        source={{uri: url.current }} 
        onMessage={(event) => {
          const { nativeEvent } = event;

          entryCaptures(nativeEvent.data);
        }}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
      >
      </WebView>
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
