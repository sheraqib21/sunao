import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
  Dimensions,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';

// Import songs data from the JSON file
const songsFromLibrary = require('../../assets/data/library.json');

const screenWidth = Dimensions.get('window').width;

const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<any | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [songDuration, setSongDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [songs, setSongs] = useState<any[]>([]); // This will contain both library and downloaded songs
  const [selectedSong, setSelectedSong] = useState<any | null>(null); // To track the song to delete

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound && isPlaying) {
        sound.getStatusAsync().then((status) => {
          if (status.isLoaded && status.isPlaying) {
            setCurrentPosition(status.positionMillis);
            setSongDuration(status.durationMillis || 0);
          }
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound, isPlaying]);

  useEffect(() => {
    fetchSongs();
  }, []);

  // Fetch audio files from the local server
  const fetchSongs = async () => {
    try {
      const response = await fetch('http://192.168.10.235:3000/list'); // Replace with your machine's IP address
      const data = await response.json(); // This will be a list of files like ['song1.m4a', 'song2.webm']

      const downloadedSongs = await Promise.all(data.map(async (file: string) => {
        const title = file.split('.')[0]; // Extract title from filename
        const artist = 'Your Artist Name'; // Replace with your logic or metadata if available
        const artwork = `http://192.168.10.235:3000/downloads/${title}.jpg`; // Assuming artwork files are named the same as the audio files

        return {
          title,
          url: `http://192.168.10.235:3000/downloads/${file}`, // Access the file from the server
          artwork: artwork, // Use the constructed artwork URL
          artist: artist, // Use the associated artist name
        };
      }));

      setSongs([...songsFromLibrary, ...downloadedSongs]); // Combine library songs and downloaded songs
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const playSound = async (song: any) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.url });
    setSound(newSound);
    setIsPlaying(true);
    setCurrentSong(song);
    await newSound.playAsync();
    setModalVisible(true);
  };

  const togglePlayPause = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex((song: any) => song.title === currentSong?.title);
    if (currentIndex < songs.length - 1) {
      playSound(songs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex((song: any) => song.title === currentSong?.title);
    if (currentIndex > 0) {
      playSound(songs[currentIndex - 1]);
    }
  };

  const stopSoundAndCloseMiniPlayer = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setIsPlaying(false);
      setSound(null);
      setCurrentSong(null); // This will hide the mini-player
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Function to delete a song
  const deleteSong = (song: any) => {
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${song.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setSongs(songs.filter((s) => s.title !== song.title)); // Remove the song from state
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Heading */}
      <Text style={styles.heading}>All Songs</Text>

      {/* Song List */}
      <FlatList
        data={songs} // Load all songs from the library and downloaded songs
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.songItem}
            onPress={() => playSound(item)}
            onLongPress={() => deleteSong(item)} // Long press to delete
          >
            <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
            <View style={styles.songDetails}>
              <Text style={styles.songTitle}>{item.title}</Text>
              <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.title}
      />

      {/* Mini Player */}
      {currentSong && (
        <TouchableOpacity style={styles.miniPlayer} onPress={() => setModalVisible(true)}>
          <View style={styles.miniPlayerContent}>
            <Image source={{ uri: currentSong.artwork }} style={styles.miniPlayerArtwork} />
            <View style={styles.miniPlayerInfo}>
              <Text style={styles.miniPlayerTitle}>{currentSong.title}</Text>
              <Text style={styles.miniPlayerArtist}>{currentSong.artist}</Text>
            </View>
            <View style={styles.miniPlayerControls}>
              <Ionicons name="heart" size={30} color="red" style={styles.miniHeartIcon} />
              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={stopSoundAndCloseMiniPlayer}>
                <Ionicons name="close" size={30} color="white" style={styles.closeIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <Slider
            style={styles.progressBarMini}
            value={currentPosition}
            minimumValue={0}
            maximumValue={songDuration}
            minimumTrackTintColor="#1db954"
            maximumTrackTintColor="#ccc"
            onSlidingComplete={async (value) => {
              if (sound) {
                await sound.setPositionAsync(value);
              }
            }}
          />
        </TouchableOpacity>
      )}

      {/* Full-Screen Player Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {currentSong && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Now Playing</Text>
            <Text style={styles.modalArtist}>{currentSong.artist}</Text>
            <Image source={{ uri: currentSong.artwork }} style={styles.modalArtwork} />

            <Text style={styles.modalSongTitle}>{currentSong.title}</Text>

            {/* Playback Progress */}
            <Slider
              style={styles.progressBar}
              value={currentPosition}
              minimumValue={0}
              maximumValue={songDuration}
              minimumTrackTintColor="#1db954"
              maximumTrackTintColor="#ccc"
              onSlidingComplete={async (value) => {
                if (sound) {
                  await sound.setPositionAsync(value);
                }
              }}
            />

            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
              <Text style={styles.timeText}>{formatTime(songDuration)}</Text>
            </View>

            {/* Playback Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={handlePrevious}>
                <Ionicons name="play-skip-back" size={40} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlayPause}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={60} color="white" />
              </TouchableOpacity>

              <TouchableOpacity onPress={handleNext}>
                <Ionicons name="play-skip-forward" size={40} color="white" />
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  heading: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  songItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  songArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  songDetails: {
    marginLeft: 10,
  },
  songTitle: {
    fontSize: 16,
    color: 'white',
  },
  songArtist: {
    fontSize: 14,
    color: 'gray',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 95, // Move it above the nav bar
    width: screenWidth,
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniPlayerArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  miniPlayerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  miniPlayerTitle: {
    fontSize: 14,
    color: 'white',
  },
  miniPlayerArtist: {
    fontSize: 12,
    color: 'gray',
  },
  miniHeartIcon: {
    marginRight: 20,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    marginLeft: 10,
  },
  progressBarMini: {
    width: '100%',
    height: 20,
    marginTop: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalArtist: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  modalArtwork: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalSongTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  progressBar: {
    width: '80%',
    height: 40,
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  timeText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignItems: 'center',
    marginBottom: 30,
  },
});

export default MusicPlayer;
