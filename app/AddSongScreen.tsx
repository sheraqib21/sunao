import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddSongScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigation = useNavigation(); // To navigate back after adding song

  const handleAddSong = async () => {
    const videoId = url.split('v=')[1]?.split('&')[0]; // Extract video ID from URL
    const thumbnailUrl = `http://192.168.10.179:3000/downloads/${videoId}.jpg`; // Construct thumbnail URL

    const newSong = { url, artwork: thumbnailUrl, playlist: [], rating: 0 };

    try {
      const response = await fetch('http://192.168.10.179:3000/add-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
      });

      if (response.ok) {
        Alert.alert('Success', 'Song added successfully');
        navigation.goBack(); // Navigate back to the home screen
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
