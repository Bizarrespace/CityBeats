
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import About from './components/About.js';
import Home from './components/Home.js'
import Search from './components/Search.js'

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name = 'Home' component = {Home} options= {{ title: 'CityBeats' }} />
          <Stack.Screen name = 'About' component = {About} options= {{ title: 'About' }} />
          <Stack.Screen name = 'Search' component = {Search} options= {{ title: 'Search' }} />
        </Stack.Navigator>  
      </NavigationContainer>      
    </SafeAreaProvider>
  );
}

export default App;
