import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface Song {
  id: number;
  title: string;
  artist: {
    name: string;
  };
  album: {
    cover_medium: string;
  };
  preview: string;
}

const HomeScreen: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('https://api.deezer.com/chart/0/tracks?limit=50');
        setSongs(response.data.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    fetchSongs();
  }, []);

  const renderItem = ({ item }: { item: Song }) => (
    <TouchableOpacity 
      style={[
        styles.songItem, 
        currentSong?.id === item.id ? styles.currentSong : null
      ]} 
      onPress={() => {
        setCurrentSong(item);
        navigation.navigate('Player', { song: item });
      }}
    >
      <Image 
        source={{ uri: item.album.cover_medium }}
        style={styles.albumArt}
      />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.artistName}>{item.artist.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={songs}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  songItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  currentSong: {
    backgroundColor: '#e0f7fa',
  },
  albumArt: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  artistName: {
    color: '#555',
  },
});

export default HomeScreen;