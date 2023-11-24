import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput, Alert, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Home = ({ navigation }) => {
  const [city, setCity] = useState('');

  const handleSearch = () => {
    const trimmedCity = city.trim();
    Keyboard.dismiss();
    Alert.alert(
      'Confirm City',
      `You entered ${trimmedCity}. Is this correct?`,
      [
        {text: 'No'},
        {text: 'Yes', onPress: () => navigation.navigate('Search', { city:trimmedCity })},
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient
      colors={['#F5FCFF', '#841584']}
      style={styles.container}
    >
      <Image
        style={styles.logo}
        source={require('../assets/logo.png')}
      />
      <Text style={styles.title}>Welcome to CityBeats</Text>
      <Text style={styles.description}>Discover the latest music trends in your city!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Enter City'
          placeholderTextColor="black"
          onChangeText={text => setCity(text)}
          value={city}
          onSubmitEditing={handleSearch}
        />
        <Button 
          title='Confirm'
          onPress={handleSearch}
          color='lightcoral'
          style={styles.button}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title='View Search History'
          onPress={() => navigation.navigate('History')}
          color='#841584'
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title='About'
          onPress={() => navigation.navigate('About')}
          color='#841584'
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '30%',
    marginTop: -150,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '80%',
    overflow: 'hidden',
  },
  input: {
    height: 40,
    borderColor: 'lightcoral',
    borderWidth: 1,
    paddingLeft: 10,
    width: '70%',
    color: 'black',
  },
  button: {
    width: '30%',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
});

export default Home;
