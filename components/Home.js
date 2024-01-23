import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TextInput, Alert, Keyboard, PermissionsAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';

const Home = ({ navigation }) => {
  const [city, setCity] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [markerLocation, setMarkerLocation] = useState(null);

  const mapRef = React.useRef(null);

  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app requires access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location");
      } else {
        console.log("Location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const fetchCityName = (latitude, longitude) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=`)
      .then(response => response.json())
      .then(data => {
        const cityName = data.results[0].address_components.find(component => component.types.includes('locality')).long_name;
        console.log(cityName);
        setCity(cityName); // Set the city state
      })
      .catch(error => console.error(error));
  }

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        fetchCityName(latitude, longitude);
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 1000);
        }
        setShowMap(true);
      },
      error => alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }

  const handleSearch = () => {
    const trimmedCity = city.trim();
    Keyboard.dismiss();
    Alert.alert(
      'Confirm City',
      `You entered ${trimmedCity}. Is this correct?`,
      [
        { text: 'No' },
        { text: 'Yes', onPress: () => navigation.navigate('Search', { city: trimmedCity }) },
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
      <View style={styles.buttonContainer}>
        <Button
          title='Get current location'
          onPress={getLocation}
          color='#841584'
        />
      </View>
      {showMap && currentLocation && (
        <MapView
          ref={mapRef}
          style={{ alignSelf: 'stretch', height: 225 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onLongPress={(e) => {
            setMarkerLocation(e.nativeEvent.coordinate);
            fetchCityName(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
          }}
        >
          {markerLocation && (
            <Marker
              coordinate={{
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }}
            />
          )}
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
            />
          )}
        </MapView>
      )}
      {showMap && (
        <View style={{ flexDirection: 'row', paddingTop: 5, justifyContent: 'space-between' }}>
          <View style={styles.adjacentButton}>
            <View style={styles.button}>
              <Button
                title='Close Map'
                onPress={() => setShowMap(false)}
                color='lightcoral'
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Europe'
                onPress={() => {
                  const location = { latitude: 52.5200, longitude: 13.4050 };
                  setCurrentLocation(location);
                  fetchCityName(location.latitude, location.longitude);
                  mapRef.current.animateToRegion({
                    ...location,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }, 1000);
                }}
                color='lightcoral'
              />
            </View>
            <View style={styles.button}>
              <Button
                title='Australia'
                onPress={() => {
                  const location = { latitude: -33.8688, longitude: 151.2093 };
                  setCurrentLocation(location);
                  fetchCityName(location.latitude, location.longitude);
                  mapRef.current.animateToRegion({
                    ...location,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }, 1000);
                }}
                color='lightcoral'
              />
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  adjacentButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    margin: 10, // Adjust this value as needed
  },
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
    marginBottom: 5,
    width: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },

});

export default Home;
