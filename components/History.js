import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, ScrollView, Button, Alert, View, Text } from 'react-native';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog";

const History = () => {
  const [allCitiesData, setAllCitiesData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cityToRemove, setCityToRemove] = useState('');
  const [mostFrequentSongData, setMostFrequentSongData] = useState(null);

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
        setAllCitiesData(songs);
      });
  }, []);

  const resetHistory = () => {
    setDialogVisible(true);
  };

  const handleDialogSubmit = () => {
    const cityExists = allCitiesData.some(singleCityData => singleCityData.city === cityToRemove);
    if (!cityExists) {
      Alert.alert('Error', 'That City does not exist in history');
      return;
    }
    AsyncStorage.removeItem(cityToRemove).then(() => {
      const updatedCitySongs = allCitiesData.filter(singleCityData => singleCityData.city !== cityToRemove);
      setAllCitiesData(updatedCitySongs);
    });
    setDialogVisible(false);
    setCityToRemove(''); // Reset the input
  };

  const handlePress = (index) => setExpanded(expanded === index ? null : index);

  useEffect(() => {
    if (allCitiesData.length === 0) {
      return;
    }
    let songOccurrenceCount = {};

    allCitiesData.forEach(singleCityData => {
      singleCityData.songs.forEach(individualSong => {
        let songTitle = individualSong.title.replace(/^\d+\.\s/, '');
        if (!songOccurrenceCount[songTitle]) {
          songOccurrenceCount[songTitle] = { count: 0, song: individualSong };
        }
        songOccurrenceCount[songTitle].count += 1;
      });
    });

    if (Object.keys(songOccurrenceCount).length > 0) {
      const mostFrequent = Object.values(songOccurrenceCount).reduce((a, b) => a.count > b.count ? a : b);
      setMostFrequentSongData(mostFrequent);
    }

  }, [allCitiesData]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Button title="Remove City from History" onPress={resetHistory} />
      {mostFrequentSongData && (
        <View style={{ padding: 20, backgroundColor: '#f8f8f8', margin: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Most Frequent Song</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>{mostFrequentSongData.song.title.replace(/^\d+\.\s/, '')}</Text>
          <Text style={{ fontSize: 16, color: '#333' }}>Count: {mostFrequentSongData.count}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(mostFrequentSongData.song.url)}>
            <Image source={{ uri: mostFrequentSongData.song.image }} style={{ width: 125, height: 125, marginTop: 10 }} />
          </TouchableOpacity>
        </View>
      )}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Enter city name</Dialog.Title>
        <Dialog.Description>
          Enter the name of the city you want to remove from the history
        </Dialog.Description>
        <Dialog.Input onChangeText={setCityToRemove}></Dialog.Input>
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Delete" onPress={handleDialogSubmit} />
      </Dialog.Container>
      {allCitiesData.map((singleCityData, index) => (
        <List.Accordion
          key={index}
          title={`${singleCityData.city} (${singleCityData.dateAdded.toLocaleDateString()} ${singleCityData.dateAdded.toLocaleTimeString()})`}
          expanded={expanded === index}
          onPress={() => handlePress(index)}
          right={() =>  <Image source={require('../assets/right.png')} style={{ width: 25, height: 25 }} />}
        >
          {singleCityData.songs.map((song, songIndex) => (
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