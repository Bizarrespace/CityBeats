import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, Linking, ScrollView, Button, Alert, View, Text, Dimensions } from 'react-native';
import { List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dialog from "react-native-dialog";
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const History = () => {
  const navigation = useNavigation();
  const [allCitiesData, setAllCitiesData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cityToRemove, setCityToRemove] = useState('');
  const [mostFrequentSongData, setMostFrequentSongData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

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

  const generateUniqueColor = (existingColors) => {
    let color;
    do {
      color = '#' + (Math.floor(Math.random() * 16777215).toString(16)).padStart(6, '0');
    } while (existingColors.includes(color));
    return color;
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

  const removeAllData = () => {
    AsyncStorage.clear().then(() => {
      setAllCitiesData([]);
      navigation.navigate('Home');
    });
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

    let mostFrequentSongs = null;
    if (Object.keys(songOccurrenceCount).length > 0) {
      const sortedCounts = [...new Set(Object.values(songOccurrenceCount)
        .map(songData => songData.count))].sort((a, b) => b - a);
      const highestCount = sortedCounts[0];
      const secondHighestCount = sortedCounts[1];
      const thirdHighestCount = sortedCounts[2];
      const fourHighestCount = sortedCounts[3];

      let songData = [highestCount, secondHighestCount];
      if (thirdHighestCount > 2) {
        songData.push(thirdHighestCount);
      } 
      if (fourHighestCount > 3){
        songData.push(fourHighestCount);
      }

      mostFrequentSongs = Object.values(songOccurrenceCount).filter(
        songDataItem => songData.includes(songDataItem.count)
      );

      mostFrequentSongs.sort((a, b) => b.count - a.count);
      setMostFrequentSongData(mostFrequentSongs);

    }

    let songDistribution = {};
    let existingColors = [];
    if (mostFrequentSongs) {
      allCitiesData.forEach(singleCityData => {
        singleCityData.songs.forEach(individualSong => {
          let songTitle = individualSong.title.replace(/^\d+\.\s/, '');
          if (mostFrequentSongs.some(mostFrequentSong => songTitle === mostFrequentSong.song.title.replace(/^\d+\.\s/, ''))) {
            if (songDistribution[singleCityData.city]) {
              songDistribution[singleCityData.city].count += 1;
              if (!songDistribution[singleCityData.city].songs.includes(songTitle)) {
                songDistribution[singleCityData.city].songs.push(songTitle);
              }
            } else {
              let color = generateUniqueColor(existingColors);
              existingColors.push(color);
              songDistribution[singleCityData.city] = {
                count: 1,
                songs: [songTitle],
                color: color
              };
            }
          }
        });
      });
    }

    // Convert songDistribution to an array of objects that the PieChart component can use
    let pieChartData = Object.keys(songDistribution).map(city => ({
      name: city,
      count: songDistribution[city].count,
      songs: songDistribution[city].songs,
      color: songDistribution[city].color,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }));

    setPieChartData(pieChartData);
  }, [allCitiesData]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity
        onPress={removeAllData}
        style={{ backgroundColor: '#841584', marginBottom: 10,  marginTop: 10, width: 110, height: 40, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 5 }}
      >
        <Text style={{ color: 'white' }}>Remove All Data</Text>
      </TouchableOpacity>
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
      {allCitiesData.map((singleCityData, index) => (
        <List.Accordion
          key={index}
          title={`${singleCityData.city} (${singleCityData.dateAdded.toLocaleDateString()} ${singleCityData.dateAdded.toLocaleTimeString()})`}
          expanded={expanded === index}
          onPress={() => handlePress(index)}
          right={() => <Image source={require('../assets/right.png')} style={{ width: 25, height: 25 }} />}
        >
          {singleCityData.songs.map((song, songIndex) => (
            <List.Item
              key={songIndex}
              title={song.title}
              description={song.artist}
              left={() => (
                <TouchableOpacity onPress={() => Linking.openURL(song.url)}>
                  <Image source={{ uri: song.image || 'https://via.placeholder.com/150' }} style={{ width: 125, height: 125, marginTop: 10 }} />
                </TouchableOpacity>
              )}
            />
          ))}
        </List.Accordion>
      ))}
      {mostFrequentSongData && (
        <View style={{ padding: 20, backgroundColor: '#f8f8f8', margin: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black' }}>Most Frequent Songs</Text>
          <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', paddingTop: 10 }}>Total Songs: {mostFrequentSongData.length}</Text>
          {mostFrequentSongData.map((songData, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold', paddingTop: 10 }}>{songData.song.title.replace(/^\d+\.\s/, '')}</Text>
              <Text style={{ fontSize: 14, color: '#333' }}>By: {songData.song.artist}</Text>
              <Text style={{ fontSize: 14, color: '#333' }}>Count: {songData.count}</Text>
              <TouchableOpacity onPress={() => Linking.openURL(songData.song.url)}>
                <Image source={{ uri: songData.song.image }} style={{ width: 125, height: 125, marginTop: 10 }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {pieChartData && (
        <View style={{ padding: 20, backgroundColor: '#f8f8f8', margin: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Number of most frequent songs in each city</Text>
          <PieChart
            data={pieChartData}
            width={Dimensions.get('window').width - 16}
            height={220}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            accessor="count"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      )}
      {pieChartData && (
        <View style={{ padding: 20, backgroundColor: '#f8f8f8', margin: 20, borderRadius: 10, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'black' }}>Popular songs by City</Text>
          {pieChartData.map((cityData, index) => (
            <View key={index} style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ fontSize: 25, color: cityData.color, fontWeight: 'bold' }}>{cityData.name}</Text>
              {cityData.songs.sort().map((song, songIndex) => (
                <Text key={songIndex} style={{ fontSize: 14, color: '#333' }}>{songIndex + 1}. {song}</Text>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default History;