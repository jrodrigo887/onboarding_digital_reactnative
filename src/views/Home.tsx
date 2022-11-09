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
 import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
 import SelectDropdown from 'react-native-select-dropdown';
 interface SelectOption {
  label: string;
  value: string;
 } 
const Home = ({navigation}: {navigation: any}) => {
    const [text, onChangeText] = useState('')
    const [urlFull, setChangeUrlFull] = useState('')
    const [ambient, onChangeAmbient] = useState('http://192.168.100.41:8082/onboarding/autoid/c873938a-7c34-43a8-9218-66f6b45e3066')
    function handleNavigate() {
      navigation.navigate('AppWebView', { url: urlFull })
    }

    const ambients: SelectOption[] = [
      { label: 'Prod', value: 'https://app.certfy.tech/onboarding/autoid/' },
      { label: 'Dev', value: 'https://app-dev.certfy.tech/onboarding/autoid/' },
      { label: 'Test', value: 'https://app-test.certfy.tech/onboarding/autoid/' },
      { label: 'Homol', value: 'https://app-hmlg.certfy.tech/onboarding/autoid/' },
      { label: 'locahost', value: 'http://192.168.100.41:8082/onboarding/autoid/' },
    ]

    const topics: SelectOption[] = [
      { label: 'AutoId Prod', value: '' },
      { label: 'AutoId Dev', value: 'c873938a-7c34-43a8-9218-66f6b45e3066' },
      { label: 'AutoId Test', value: 'c2e8f18b-ea7d-4d85-96b4-e3a8906d4a9a' },
      { label: 'AutoId Homol', value: '' },
    ]
    
    function onChangeInputText() {
      setChangeUrlFull(ambient+text)
    }

    function onClear() {
      setChangeUrlFull('')
      onChangeAmbient('')
      onChangeText('')
    }

   return (
     <View style={styles.container}>
        <Text>
          Ambiente:   
        </Text>
        <SelectDropdown
            data={ambients}
            onSelect={(selectedItem: SelectOption, index: number) => {
              onChangeAmbient(selectedItem.value)
            }}
            buttonTextAfterSelection={(selectedItem: SelectOption, index: number) => {
              return selectedItem.label
            }}
            rowTextForSelection={(item: SelectOption, index: number) => {
              return item.label
            }}
        />
        <Text>
          Assunto:   
        </Text>
        <SelectDropdown
            data={topics}
            onSelect={(selectedItem: SelectOption, index: number) => {
              onChangeText(selectedItem.value)
            }}
            buttonTextAfterSelection={(selectedItem: SelectOption, index: number) => {
              return selectedItem.label
            }}
            rowTextForSelection={(item: SelectOption, index: number) => {
              return item.label
            }}
        />

        <TextInput style={styles.input}
          onChangeText={onChangeText}
          value={text}  >
        </TextInput>
        <View style={styles.button}>
          <Button onPress={() => onChangeInputText()} title="Setar Assunto"/>
        </View>
        <View style={styles.button}>
          <Button onPress={() => onClear()} title="Limpar Assunto"/>
        </View>
        <Text>
          Url: { urlFull }
        </Text>
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
     backgroundColor: 'white',
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
  button: {
    marginTop: 16
  }
 });
 
 export default Home;
 
 
 
 
 
 
 // react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res