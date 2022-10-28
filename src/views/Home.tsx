/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 
 import { createNativeStackNavigator } from '@react-navigation/native-stack';
 import React, { useState } from 'react';
 import {Alert, Button, StyleSheet, TextInput, View} from 'react-native';

 
const Home = ({navigation}: {navigation: any}) => {
    const [text, onChangeText] = useState('https://')
    function handleNavigate() {
        navigation.navigate('AppWebView', { url: text })
    }

   return (
     <View style={styles.container}>
          <TextInput style={styles.input}
            onChangeText={onChangeText}
            value={text}
          >
          </TextInput>
         <Button onPress={() => handleNavigate()} title="Atendimento Lite"/>
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
   input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
 });
 
 export default Home;
 
 
 
 
 
 
 // react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res