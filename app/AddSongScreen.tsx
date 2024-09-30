import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddSongScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [url, setUrl] = useState('');
  const [artwork, setArtwork] = useState('');

  const navigation = useNavigation(); // To navigate back after adding song

  const handleAddSong = async () => {
    // Construct the YouTube thumbnail URL from the video URL
    const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID from URL
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Construct thumbnail URL

    const newSong = { title, artist, url, artwork: thumbnailUrl, playlist: [], rating: 0 };

    try {
      const response = await fetch('http://192.168.10.235:3000/add-song', { // Update with your machine's IP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
      });

      if (response.ok) {
        Alert.alert('Success', 'Song added successfully');
        navigation.goBack(); // Navigate back to home screen
      } else {
        Alert.alert('Error', 'Failed to add song');
      }
    } catch (error) {
      console.error('Network request failed:', error);
      Alert.alert('Error', 'Network request failed: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
        style={styles.input}
      />
      <TextInput
        placeholder="YouTube URL"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />
      <Button title="Add Song" onPress={handleAddSong} color="#841584" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default AddSongScreen;
