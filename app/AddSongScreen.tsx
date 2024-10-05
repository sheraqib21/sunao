import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SERVER_IP } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';  // Import FlashMessage

const AddSongScreen: React.FC = () => {
  const [url, setUrl] = useState('');
  const navigation = useNavigation();

  const handleAddSong = async () => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    const thumbnailUrl = `${SERVER_IP}/downloads/${videoId}.jpg`;

    const newSong = { url, artwork: thumbnailUrl, playlist: [], rating: 0 };

    try {
      const response = await fetch(`${SERVER_IP}/add-song`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSong),
      });

      if (response.ok) {
        // Display success message
        showMessage({
          message: "Success",
          description: "Song added to your library!",
          type: "success",
          icon: { icon: "success", position: "left" },
          backgroundColor: "#4BB543", // Custom green background color
          color: "#FFF", // Text color
          duration: 3000, // 3 seconds duration
        });

        navigation.goBack();  // Go back after showing message
      } else {
        // Display error message
        showMessage({
          message: "Error",
          description: "Failed to add the song. Try again.",
          type: "danger",
          icon: { icon: "danger", position: "left" },
          backgroundColor: "#FF0000", // Custom red background color
          color: "#FFF",
        });
      }
    } catch (error) {
      console.error('Network request failed:', error);
      showMessage({
        message: "Network Error",
        description: error.message,
        type: "danger",
        icon: { icon: "danger", position: "left" },
        backgroundColor: "#FF0000", // Custom red background color
        color: "#FFF",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button with Icon and Text */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" style={styles.backIcon} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="youtube-play" size={60} color="#FF0000" />
          <Text style={styles.title}>Add YouTube Song</Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="link" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            placeholder="Paste YouTube URL here"
            value={url}
            onChangeText={setUrl}
            style={styles.input}
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddSong}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={20} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add to Library</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Paste a YouTube video URL to add the song to your library
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  backButton: {
    flexDirection: 'row',  // Ensures the icon and text are in a row
    alignItems: 'center',  // Align icon and text vertically centered
    paddingLeft: 15,
    paddingTop: 45,
  },
  backIcon: {
    marginRight: 5,  // Add some space between icon and text
  },
  backText: {
    fontSize: 18,
    color: '#FFF',  // White color for the back text
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFF',
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#FF0000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default AddSongScreen;
