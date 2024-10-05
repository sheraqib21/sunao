import React, { useState, useEffect, useCallback } from 'react';
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
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { SERVER_IP } from '../../config';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const MusicPlayer: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<any | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [songDuration, setSongDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [songs, setSongs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [songToDelete, setSongToDelete] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      fetchSongs();
    }, [])
  );

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
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [searchQuery, songs]);

  const fetchSongs = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/list`);
      const data = await response.json();
  
      const downloadedSongs = await Promise.all(
        data.map(async (file: string) => {
          const videoId = file.split('.')[0];
          const videoInfo = await fetch(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`)
            .then((res) => res.json())
            .catch(() => ({ title: 'Unknown Title', author_name: 'Unknown Artist' }));
  
          return {
            id: videoId,
            title: videoInfo.title || 'Unknown Title',
            url: `${SERVER_IP}/downloads/${file}`,
            artwork: `${SERVER_IP}/downloads/${videoId}.jpg`,
            artist: videoInfo.author_name || 'Unknown Artist',
          };
        })
      );
  
      setSongs(downloadedSongs);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const playSound = async (song: any) => {
    try {
      // If a sound is already playing, stop and unload it
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }

      // Create a new sound instance for the selected song
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.url });
      setSound(newSound);
      setCurrentSong(song);
      setIsPlaying(true);
      setModalVisible(true);

      // Start playing the new song
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const togglePlayPause = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    if (currentIndex < songs.length - 1) {
      playSound(songs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
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
      setCurrentSong(null);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const deleteSong = (song: any) => {
    setSongToDelete(song);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (songToDelete) {
      try {
        await fetch(`${SERVER_IP}/delete/${songToDelete.id}`, { method: 'DELETE' });
        setSongs(songs.filter((s) => s.id !== songToDelete.id));
        setDeleteModalVisible(false);
        setSongToDelete(null);
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    }
  };

  const renderSongItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playSound(item)}
    >
      <Image source={{ uri: item.artwork }} style={styles.songArtwork} />
      <View style={styles.songDetails}>
        <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.songArtist} numberOfLines={1}>{item.artist}</Text>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={() => deleteSong(item)}>
        <Ionicons name="ellipsis-vertical" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#121212', '#1F1F1F']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.heading}>Your Music</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search songs or artists..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      {currentSong && (
        <TouchableOpacity style={styles.miniPlayer} onPress={() => setModalVisible(true)}>
          <LinearGradient colors={['#282828', '#121212']} style={styles.miniPlayerGradient}>
            <View style={styles.miniPlayerContent}>
              <Image source={{ uri: currentSong.artwork }} style={styles.miniPlayerArtwork} />
              <View style={styles.miniPlayerInfo}>
                <Text style={styles.miniPlayerTitle} numberOfLines={1}>{currentSong.title}</Text>
                <Text style={styles.miniPlayerArtist} numberOfLines={1}>{currentSong.artist}</Text>
              </View>
              <View style={styles.miniPlayerControls}>
                <TouchableOpacity onPress={togglePlayPause}>
                  <Ionicons 
                    name={isPlaying ? 'pause-circle' : 'play-circle'} 
                    size={36} 
                    color="#FF6F61"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={stopSoundAndCloseMiniPlayer}>
                  <Ionicons name="close-circle" size={36} color="#999" />
                </TouchableOpacity>
              </View>
            </View>
            <Slider
              style={styles.progressBarMini}
              value={currentPosition}
              minimumValue={0}
              maximumValue={songDuration}
              minimumTrackTintColor="#FF6F61"
              maximumTrackTintColor="#666"
              thumbTintColor="#FF6F61"
              onSlidingComplete={(val) => sound?.setPositionAsync(val)}
            />
          </LinearGradient>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <LinearGradient colors={['#121212', '#282828']} style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.modalCloseButton} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="chevron-down" size={30} color="#FFF" />
          </TouchableOpacity>

          <Image source={{ uri: currentSong?.artwork }} style={styles.modalArtwork} />

          <View style={styles.modalInfoContainer}>
            <Text style={styles.modalSongTitle}>{currentSong?.title}</Text>
            <Text style={styles.modalArtist}>{currentSong?.artist}</Text>
          </View>

          <Slider
            style={styles.progressBar}
            value={currentPosition}
            minimumValue={0}
            maximumValue={songDuration}
            minimumTrackTintColor="#FF6F61"
            maximumTrackTintColor="#666"
            thumbTintColor="#FF6F61"
            onSlidingComplete={(val) => sound?.setPositionAsync(val)}
          />

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
            <Text style={styles.timeText}>{formatTime(songDuration)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={handlePrevious}>
              <Ionicons name="play-skip-back" size={40} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons 
                name={isPlaying ? 'pause-circle' : 'play-circle'} 
                size={80} 
                color="#FF6F61" 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
              <Ionicons name="play-skip-forward" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.deleteModalContainer}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>Delete Song</Text>
            <Text style={styles.deleteModalText}>Are you sure you want to delete "{songToDelete?.title}"?</Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.deleteModalCancelButton]} 
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.deleteModalButton, styles.deleteModalConfirmButton]} 
                onPress={confirmDelete}
              >
                <Text style={styles.deleteModalButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  heading: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingVertical: 12,
  },
  songItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    marginBottom: 10,
  },
  songArtwork: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  songDetails: {
    flex: 1,
    marginLeft: 15,
  },
  songTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  moreButton: {
    padding: 5,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 95,
    width: screenWidth,
  },
  miniPlayerGradient: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  miniPlayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniPlayerArtwork: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  miniPlayerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  miniPlayerTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  miniPlayerArtist: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  miniPlayerControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  modalArtwork: {
    width: screenWidth - 80,
    height: screenWidth - 80,
    borderRadius: 20,
    marginBottom: 30,
  },
  modalInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  modalSongTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalArtist: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  timeText: {
    color: '#999',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    alignItems: 'center',
    marginBottom: 30,
  },
  deleteModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  deleteModalContent: {
    backgroundColor: '#282828',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '45%',
  },
  deleteModalCancelButton: {
    backgroundColor: '#666',
  },
  deleteModalConfirmButton: {
    backgroundColor: '#FF4136',
  },
  deleteModalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MusicPlayer;
