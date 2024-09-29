import React from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AddSongScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Song</Text>
      
      {/* Input fields for song details */}
      <TextInput
        style={styles.input}
        placeholder="Song Title"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Artist"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Album"
        placeholderTextColor="#888"
      />
      
      <Button title="Submit" onPress={() => console.log("Song added")} />
      
      {/* Button to go back */}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#333',
    color: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default AddSongScreen;
