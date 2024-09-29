import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileScreen: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('jon_lamont');
  const [editingName, setEditingName] = useState(false); // State to toggle edit mode
  const [mostListenedArtist, setMostListenedArtist] = useState('Talha Anjum');
  const [topGenres, setTopGenres] = useState(['Rap', 'Chill', 'Instrumental']);
  const [playlistsCount, setPlaylistsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(31);

  // Function to handle image selection
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access gallery is required!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#ff6f61', '#1a1a1a']} // Gradient colors from top to bottom
        style={styles.background}
      />

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="person-circle" size={100} color="#888" />
            </View>
          )}
        </TouchableOpacity>

        {/* Editable Username */}
        {editingName ? (
          <TextInput
            style={styles.usernameInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your name"
            placeholderTextColor="#ccc"
          />
        ) : (
          <Text style={styles.username}>{username}</Text>
        )}

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => setEditingName(!editingName)}
        >
          <Text style={styles.editProfileText}>{editingName ? 'Save' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statsBox}>
          <Text style={styles.statsCount}>{playlistsCount}</Text>
          <Text style={styles.statsLabel}>PLAYLISTS</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsCount}>{followersCount}</Text>
          <Text style={styles.statsLabel}>FOLLOWERS</Text>
        </View>
        <View style={styles.statsBox}>
          <Text style={styles.statsCount}>{followingCount}</Text>
          <Text style={styles.statsLabel}>FOLLOWING</Text>
        </View>
      </View>

      {/* Most Listened Artist & Top Genres */}
      <View style={styles.musicInfoContainer}>
        <View style={styles.musicInfoBox}>
          <Text style={styles.musicInfoTitle}>Most Listened Artist</Text>
          <Text style={styles.musicInfoValue}>{mostListenedArtist}</Text>
        </View>
        <View style={styles.musicInfoBox}>
          <Text style={styles.musicInfoTitle}>Top Genres</Text>
          <Text style={styles.musicInfoValue}>{topGenres.join(', ')}</Text>
        </View>
      </View>

      {/* No Recent Activity Placeholder */}
      <View style={styles.activityPlaceholder}>
        <Text style={styles.noActivityText}>No recent activity</Text>
      </View>
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
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 250, // Height for the gradient background
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40, // Ensures it's below the gradient
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  usernameInput: {
    backgroundColor: '#333',
    color: '#fff',
    fontSize: 20,
    padding: 8,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#1db954',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  statsBox: {
    alignItems: 'center',
  },
  statsCount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  musicInfoContainer: {
    marginBottom: 30,
  },
  musicInfoBox: {
    backgroundColor: '#2b2b2b',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  musicInfoTitle: {
    color: '#888',
    fontSize: 14,
    marginBottom: 5,
  },
  musicInfoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityPlaceholder: {
    alignItems: 'center',
    marginTop: 20,
  },
  noActivityText: {
    color: '#888',
    fontSize: 16,
  },
});

export default ProfileScreen;
