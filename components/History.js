import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, ScrollView, Button, Alert } from 'react-native';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog";

const History = () => {
  const [citySongs, setCitySongs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cityToRemove, setCityToRemove] = useState('');


  useEffect(() => {
    AsyncStorage.getAllKeys()
      .then(keys => {
        return AsyncStorage.multiGet(keys);
      })
      .then(items => {
        const songs = items.map(item => {
          const data = JSON.parse(item[1]);
          return {
            city: item[0],
            songs: data.songs,
            dateAdded: new Date(data.dateAdded)
          };
        });

        songs.sort((a, b) => b.dateAdded - a.dateAdded);
        setCitySongs(songs);
      });
  }, []);

  const resetHistory = () => {
    setDialogVisible(true);
  };

  const handleDialogSubmit = () => {
    const cityExists = citySongs.some(citySong => citySong.city === cityToRemove);
    if (!cityExists) {
      Alert.alert('Error', 'That City does not exist in history');
      return;
    }
    AsyncStorage.removeItem(cityToRemove).then(() => {
      const updatedCitySongs = citySongs.filter(citySong => citySong.city !== cityToRemove);
      setCitySongs(updatedCitySongs);
    });
    setDialogVisible(false);
    setCityToRemove(''); // Reset the input
  };

  const handlePress = (index) => setExpanded(expanded === index ? null : index);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Button title="Remove City from History" onPress={resetHistory} />
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Enter city name</Dialog.Title>
        <Dialog.Description>
          Enter the name of the city you want to remove from the history
        </Dialog.Description>
        <Dialog.Input onChangeText={setCityToRemove}></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Delete" onPress={handleDialogSubmit} />
      </Dialog.Container>
      {citySongs.map((citySong, index) => (
        <List.Accordion
          key={index}
          title={`${citySong.city} (${citySong.dateAdded.toLocaleDateString()} ${citySong.dateAdded.toLocaleTimeString()})`}
          expanded={expanded === index}
          onPress={() => handlePress(index)}
          right={() =>  <Image source={require('../assets/right.png')} style={{ width: 25, height: 25 }} />}
        >
          {citySong.songs.map((song, songIndex) => (
            <List.Item
              key={songIndex}
              title={song.title}
              left={() => (
                <TouchableOpacity onPress={() => Linking.openURL(song.url)}>
                  <Image source={{ uri: song.image || 'https://via.placeholder.com/150' }} style={{ width: 125, height: 125, marginTop: 10 }} />
                </TouchableOpacity>
              )}
            />
          ))}
        </List.Accordion>
      ))}
    </ScrollView>
  );
};

export default History;