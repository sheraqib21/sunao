import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';

interface Song {
  url: string;
  title: string;
  artist: string;
  artwork: string;
}

interface PlayerParams {
  currentSong: Song;
  playlist: Song[];
}

const Player: React.FC = () => {
  const route = useRoute<RouteProp<{ params: PlayerParams }, 'params'>>();
  const navigation = useNavigation();
  const { currentSong, playlist } = route.params;

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentSong]);

  const loadAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: currentSong.url },
      { shouldPlay: true },
      onPlaybackStatusUpdate
    );
    setSound(newSound);
    setupInterval(newSound);
  };

  const setupInterval = (sound: Audio.Sound) => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    const id = setInterval(async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setPosition(status.positionMillis || 0);
      }
    }, 1000);
    setIntervalId(id);
  };

  const onPlaybackStatusUpdate = (status: Audio.PlaybackStatus) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);

      // Skip to next song when current one finishes
      if (status.didJustFinish && !status.isLooping) {
        skipToNext();
      }
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        if (intervalId) {
          clearInterval(intervalId);
        }
      } else {
        await sound.playAsync();
        setupInterval(sound);
      }
    }
  };

  const skipToNext = async () => {
    const currentIndex = playlist.findIndex((song) => song.url === currentSong.url);
    const nextIndex = (currentIndex + 1) % playlist.length; // Loop back to start
    const nextSong = playlist[nextIndex];
    
    if (sound) {
      await sound.unloadAsync();
    }
    
    navigation.navigate('Player', { currentSong: nextSong, playlist });
  };

  const skipToPrevious = async () => {
    const currentIndex = playlist.findIndex((song) => song.url === currentSong.url);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length; // Loop back to end
    const prevSong = playlist[prevIndex];
    
    if (sound) {
      await sound.unloadAsync();
    }
    
    navigation.navigate('Player', { currentSong: prevSong, playlist });
  };

  const shufflePlaylist = () => {
    let shuffledPlaylist = [...playlist];
    for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
    }
    navigation.navigate('player', { currentSong: shuffledPlaylist[0], playlist: shuffledPlaylist });
  };

  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${(Number(seconds) < 10 ? '0' : '') + seconds}`;
  };

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <Text style={styles.noSongText}>No song selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-down" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <TouchableOpacity>
          <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
      
      <View style={styles.songInfo}>
        <Text style={styles.title}>{currentSong.title}</Text>
        <Text style={styles.artist}>{currentSong.artist}</Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        minimumTrackTintColor="#1DB954"
        maximumTrackTintColor="#777"
        thumbTintColor="#1DB954"
        onSlidingComplete={(value) => sound?.setPositionAsync(value)}
      />
      
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity onPress={shufflePlaylist}>
          <Ionicons name="shuffle" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToPrevious}>
          <Ionicons name="play-skip-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={skipToNext}>
          <Ionicons name="play-skip-forward" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="repeat" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.upNext}>
        <Text style={styles.upNextTitle}>UP NEXT</Text>
        {playlist.slice(0, 2).map((song, index) => (
          <View key={index} style={styles.upNextItem}>
            <Text style={styles.upNextSongTitle}>{song.title}</Text>
            <Text style={styles.upNextArtist}>{song.artist}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 50,
  },
  artwork: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginVertical: 16,
  },
  songInfo: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  artist: {
    color: '#888',
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 16,
  },
  playPauseButton: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upNext: {
    marginTop: 20,
  },
  upNextTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  upNextItem: {
    marginVertical: 10,
  },
  upNextSongTitle: {
    color: '#fff',
    fontSize: 16,
  },
  upNextArtist: {
    color: '#888',
    fontSize: 14,
  },
  noSongText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Player;