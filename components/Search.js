// Importing necessary modules and components
import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Linking, Button, Alert, TextInput, StyleSheet } from 'react-native';
import Citys from './Citys.json'; // Importing city data
import Chart from './Chart.json'; // Importing chart data
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Search component
const Search = ({ route, navigation }) => {
  // State variables
  const [listId, setListId] = useState(''); // ID of the list
  const [songs, setSongs] = useState([]); // List of songs
  const [city, setCity] = useState(route.params?.city || ''); // City name
  const [inputCity, setInputCity] = useState(''); // Input city name
  const [cityNotFound, setCityNotFound] = useState(false); // Flag for city not found

  
  // Effect hook to handle city data
  useEffect(() => {
    // Define the API call options
    const options = {
      method: 'GET',
      url: 'https://shazam.p.rapidapi.com/charts/list',
      headers: {
        'X-RapidAPI-Key': '1de34a892dmsh35fa39ad32c4339p131699jsn01632568968e',
        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
      }
    };
  
    // Make the API call
    axios.request(options)
      .then(response => {
        // Use the response data
        const cityData = response.data.countries.flatMap(country => country.cities).find(cityItem => cityItem.name === city);
        if (cityData) {
          // If city data is found, set list ID and reset city not found flag
          setListId(cityData.listid);
          setCityNotFound(false);
        } else {
          // If city data is not found, set city not found flag and show alert
          setCityNotFound(true);
          Alert.alert('City not found', `The city ${city} was not found. Please enter another city.`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, [city]);

  // Effect hook to handle list ID changes
  useEffect(() => {
    if (listId) {
      // Define the API call options
      const options = {
        method: 'GET',
        url: 'https://shazam.p.rapidapi.com/charts/track',
        params: {
          locale: 'en-US',
          listId: listId,
          pageSize: '20',
          startFrom: '0'
        },
        headers: {
          'X-RapidAPI-Key': '1de34a892dmsh35fa39ad32c4339p131699jsn01632568968e',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      };
  
      // Make the API call
      axios.request(options)
        .then(response => {
          // Map chart tracks to top songs
          const topSongs = response.data.tracks.map((track, index) => ({
            title: `${index + 1}. ${track.title}`,
            url: track.url,
            artist: track.subtitle,
            image: track.images?.coverart || 'https://via.placeholder.com/150' // default image if coverart is null
          }));
          setSongs(topSongs); // Set top songs
          // Save the songs and the date they were added
          AsyncStorage.setItem(city, JSON.stringify({ songs: topSongs, dateAdded: new Date() }));
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [listId]);

  //********************************************OLD USE EFFECT */
//   // Effect hook to handle city data
// useEffect(() => {
//   // Use the response data
//   const cityData = Citys.countries.flatMap(country => country.cities).find(cityItem => cityItem.name === city);
//   if (cityData) {
//     // If city data is found, set list ID and reset city not found flag
//     setListId(cityData.listid);
//     setCityNotFound(false);
//   } else {
//     // If city data is not found, set city not found flag and show alert
//     setCityNotFound(true);
//     Alert.alert('City not found', `The city ${city} was not found. Please enter another city.`);
//   }
// }, [city]);

// // Effect hook to handle list ID changes
// useEffect(() => {
//   if (listId) {
//     // Map chart tracks to top songs
//     const topSongs = Chart.tracks.map((track, index) => ({
//       title: `${index + 1}. ${track.title}`,
//       url: track.url,
//       image: track.images?.coverart || 'https://via.placeholder.com/150' // default image if coverart is null
//     }));
//     setSongs(topSongs); // Set top songs
//   }
// }, [listId]);



  // Effect hook to handle navigation options
  useEffect(() => {
    navigation.setOptions({
      // Set header right button to navigate to history
      headerRight: () => (
        <Button
          title="History"
          onPress={() => {
            navigation.navigate('History', { songs: songs, city: city });
          }}
        />
      ),
    });
  }, [navigation, songs, city]);

  // Function to render each item in the list
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </TouchableOpacity>
      <View style={styles.itemSpacing} />
    </View>
  );

  // Return the component view
  return (
    <View style={styles.container}>
      {cityNotFound ? (
        // If city is not found, show input field to enter another city
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>City not found</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter another city"
            placeholderTextColor={"black"}
            onChangeText={text => setInputCity(text)}
            value={inputCity}
          />
          <Button 
            title = "Submit"
            color = "#841584"
            onPress={() => setCity(inputCity)} 
            style={styles.submitButton}/>
        </View>
      ) : (
        // If city is found, show list of songs
        <FlatList
          data={songs}
          keyExtractor={item => item.url}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    alignItems: 'center',
  },
  itemTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemImage: {
    width: 125,
    height: 125,
    marginTop: 10,
  },
  itemSpacing: {
    height: 50,
  },
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    color: 'black',
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 5,
  },
});

export default Search;

