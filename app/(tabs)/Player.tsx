// app/(tabs)/Player.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

const PlayerScreen: React.FC = () => {
  const route = useRoute();
  const { song } = route.params;
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.audioUrl }, // Use the audioUrl field
          { shouldPlay: true }
        );
        setSound(sound);
        setIsPlaying(true);
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
      <Image source={{ uri: song.image[3]['#text'] }} style={styles.albumArt} />
      <Text style={styles.title}>{song.name}</Text>
      <Text style={styles.artist}>{song.artist.name}</Text>
      <Text style={styles.playCount}>Play Count: {song.playcount}</Text>
      <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumArt: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 18,
    color: '#555',
  },
  playCount: {
    fontSize: 16,
    color: '#999',
  },
});

export default PlayerScreen;