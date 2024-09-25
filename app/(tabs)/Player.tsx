import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const PlayerScreen: React.FC = () => {
  const route = useRoute();
  const { song } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.preview },
          { shouldPlay: false }
        );
        setSound(sound);
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: song.album.cover_medium }} style={styles.albumArt} />
      <Text style={styles.title}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist.name}</Text>
      <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={50} color="#1DB954" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  albumArt: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  artist: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
  },
});

export default PlayerScreen;