import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import songLibrary from '../../assets/data/library';

interface Song {
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  rating?: number;
  playlist?: string[];
}

const HomeScreen: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    setSongs(songLibrary);
    setFilteredSongs(songLibrary);
  }, []);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(text.toLowerCase()) ||
      (song.artist && song.artist.toLowerCase().includes(text.toLowerCase()))
    );
    setFilteredSongs(filtered);
  };

  const navigateToPlayer = (song: Song, index: number) => {
    if (!song) return; // Ensure the song exists
  
    // Navigate to Player screen with the current song and playlist as params
    navigation.navigate('Player', { 
      currentSong: song,  // Pass current song object
      playlist: filteredSongs,  // Pass playlist for up-next functionality
    });
  };

  const renderItem = ({ item, index }: { item: Song; index: number }) => (
    <TouchableOpacity style={styles.songItem} onPress={() => navigateToPlayer(item, index)}>
      <Image source={{ uri: item.artwork || 'https://example.com/placeholder.jpg' }} style={styles.artwork} />
      <View style={styles.songInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.artist}>{item.artist}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.songsLabel}>Songs</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
        
          style={styles.searchBar}
          placeholder="Search"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredSongs}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  songsLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    height: 40,
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 10,
    color: 'white',
    flex: 1,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  songInfo: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
});

export default HomeScreen;
