import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chatbot from './Chatbot';
import PredictDisease from './PredictDisease';

const Stack = createStackNavigator();

class App extends React.Component {
  render() {
    return (
      <>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Chatbot" component={Chatbot} />
            <Stack.Screen name="PredictDisease" component={PredictDisease} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }
}

export default App;