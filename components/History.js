import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

// History component to display the history of searched songs
const History = ({ route }) => {
  // State variable to hold the array of song objects
  const [songs, setSongs] = useState([]);
  // Fetching the song data from the Search component
  const songsData = route.params?.songs || [];
  // Fetching the city name from the Search component
  const cityName = route.params?.city
  // State variable to manage the accordion state
  const [expanded, setExpanded] = useState(null);

  //Effect hook to set songs object into the array of songs objects
  useEffect(() => {
    // We need to check if songsData is not empty before setting the state.
    // If we don't, and songsData is empty, it will trigger an infinite loop.
    // This is because setting the state with an empty songsData is considered a state change,
    // which triggers the useEffect hook again, creating the loop.
    if (songsData && songsData.length > 0) {
      setSongs(songsData);
    }
  }, [songsData]);

  //Function to take care of only opening and closing the right accordion
  const handlePress = (index) => setExpanded(expanded === index ? null : index);

  // Rendering the History component
  return (
    <ScrollView style={{ flex: 1 }}>
      <List.Accordion
        title={cityName}
        expanded={expanded === 0}
        onPress={() => handlePress(0)}
      >
        {/* Mapping through the songs array and creating a List.Item for each song */}
        {songs.map((song, index) => (
          <List.Item
            key={index} // Using the index as a key for each List.Item
            title={song.title} // Setting the title of the List.Item to the song's title
            left={() => (
              // Creating a TouchableOpacity that opens the song's URL when pressed
              <TouchableOpacity onPress={() => Linking.openURL(song.url)}>
                {/* Displaying the song's image, or a placeholder image if the song's image is not available */}
                <Image source={{ uri: song.image || 'https://via.placeholder.com/150'}} style={{ width: 125, height: 125, marginTop: 10 }} />
              </TouchableOpacity>
            )}
          />
        ))}
      </List.Accordion>
      <List.Accordion
      title="Test"
      expanded={expanded === 1}
      onPress={() => handlePress(1)}
      >
        <Image source={{ uri: 'https://via.placeholder.com/150'}} style={{ width: 125, height: 125, marginTop:10}} />
      </List.Accordion>
    </ScrollView>
  );
};

// Exporting the History component
export default History;