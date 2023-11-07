
import React from 'react';
import {
  Text,
  SafeAreaView,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Text>Hello Test</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
