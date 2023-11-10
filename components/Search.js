import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, TouchableOpacity, Linking } from 'react-native';
import Citys from './Citys.json';
import Chart from './Chart.json';

const Search = ({ route }) => {
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
      const topSongs = Chart.tracks.map(track => ({
        title: track.title,
        url: track.url,
        image: track.images?.coverart || 'https://via.placeholder.com/150' // default image if coverart is null
      }));
      setSongs(topSongs);
    }
  }, [listId]);

  const renderItem = ({ item }) => (
    <View>
      <Text style={{ color: 'black' }}>{item.title}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
      </TouchableOpacity>
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
