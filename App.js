
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
        <Text>Hello Github new Branch</Text>
        <Text>Testing again to make sure that I have branching set up correctly</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
