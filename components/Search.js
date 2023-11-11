import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Linking, Button } from 'react-native';
import Citys from './Citys.json';
import Chart from './Chart.json';

const Search = ({ route, navigation }) => {
  const [listId, setListId] = useState('');
  const [songs, setSongs] = useState([]);
  const city = route.params?.city || '';

  useEffect(() => {
    const cityData = Citys.countries.flatMap(country => country.cities).find(cityItem => cityItem.name === city);
    if (cityData) {
      setListId(cityData.listid);
    }
  }, [city]);

  useEffect(() => {
    if (listId) {
      const topSongs = Chart.tracks.map((track, index) => ({
        title: `${index + 1}. ${track.title}`,
        url: track.url,
        image: track.images?.coverart || 'https://via.placeholder.com/150' // default image if coverart is null
      }));
      setSongs(topSongs);
    }
  }, [listId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="History"
          onPress={() => {
            navigation.navigate('History', { songs: songs, city: city });
          }}
        />
      ),
    });
  }, [navigation, songs]);

  const renderItem = ({ item }) => (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Image source={{ uri: item.image }} style={{ width: 125, height: 125, marginTop: 10 }} />
      </TouchableOpacity>
      <View style={{ height: 50 }} />
    </View>
  );

  return (
    <View>
      <Text style={{ color: 'black' }}>{city}</Text>
      <FlatList
        data={songs}
        keyExtractor={item => item.url}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Search;

