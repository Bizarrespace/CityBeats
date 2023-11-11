import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

const History = ({ route }) => {
  const [songs, setSongs] = useState([]);
  const songsData = route.params?.songs || [];
  const cityName = route.params?.city
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    if (songsData) {
      setSongs(songsData);
    }
  }, [songsData]);

  const handlePress = (index) => setExpanded(expanded === index ? null : index);

  return (
    <ScrollView style={{ flex: 1 }}>
      <List.Accordion
        title={cityName}
        expanded={expanded === 0}
        onPress={() => handlePress(0)}
      >
        {songs.map((song, index) => (
          <List.Item
            key={index}
            title={song.title}
            left={() => (
              <TouchableOpacity onPress={() => Linking.openURL(song.url)}>
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

export default History;