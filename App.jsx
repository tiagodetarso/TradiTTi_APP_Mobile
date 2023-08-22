import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux'
import store from './src/store/index'

import Opening from './src/screens/Opening'
import Entry from './src/screens/Entry'
import Inside from './src/screens/Inside'
import Retrieve from './src/screens/Retrieve'
import Reset from './src/screens/Reset'
import SignUp from './src/screens/SignUp'
import Validate from './src/screens/Validate'
import SelectedProduct from './src/screens/SelectedProduct'

const Stack = createStackNavigator();

export default function App() {

  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer
          initialRouteName='Início'
        >
          <Stack.Navigator>
            <Stack.Screen name="Inicio" component={Opening}></Stack.Screen>
            <Stack.Screen name="Login" component={Entry} />
            <Stack.Screen name="Boston Esfiharia" component={Inside} />
            <Stack.Screen name="Produto Selecionado" component={SelectedProduct} />
            <Stack.Screen name="Recuperação de Senha" component={Retrieve} />
            <Stack.Screen name="Redefinição de Senha" component={Reset} />
            <Stack.Screen name="Cadastre-se" component={SignUp} />
            <Stack.Screen name="Validação de Cadastro" component={Validate} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}