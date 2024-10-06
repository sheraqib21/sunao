import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert, Dimensions, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('jon_lamont');
  const [editingName, setEditingName] = useState(false);
  const [mostListenedArtist, setMostListenedArtist] = useState('Talha Anjum');
  const [topGenres, setTopGenres] = useState(['Rap', 'Chill', 'Instrumental']);
  const [playlistsCount, setPlaylistsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(31);

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
      <ScrollView style={styles.scrollView}>
        <Text style={styles.heading}>Your Profile</Text>
        
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

          <View style={styles.nameSection}>
            {editingName ? (
              <TextInput
                style={styles.usernameInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
                placeholderTextColor="#888"
              />
            ) : (
              <Text style={styles.username}>{username}</Text>
            )}

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setEditingName(!editingName)}
            >
              <Text style={styles.editProfileText}>{editingName ? 'Save' : 'Edit Profile'}</Text>
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity style={styles.musicInfoBox}>
            <View style={styles.musicInfoHeader}>
              <Ionicons name="musical-notes" size={20} color="#FF6F61" />
              <Text style={styles.musicInfoTitle}>Most Listened Artist</Text>
            </View>
            <Text style={styles.musicInfoValue}>{mostListenedArtist}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.musicInfoBox}>
            <View style={styles.musicInfoHeader}>
              <Ionicons name="apps" size={20} color="#FF6F61" />
              <Text style={styles.musicInfoTitle}>Top Genres</Text>
            </View>
            <View style={styles.genreContainer}>
              {topGenres.map((genre, index) => (
                <View key={index} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* Activity Section */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Ionicons name="time" size={20} color="#FF6F61" />
            <Text style={styles.activityTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityPlaceholder}>
            <Ionicons name="musical-notes" size={40} color="#666" />
            <Text style={styles.noActivityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Your listening activity will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Changed background color to a matching dark gray
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#FF6F61',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    alignItems: 'center',
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
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 10,
    width: screenWidth * 0.7,
  },
  editProfileButton: {
    backgroundColor: '#FF6F61',
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
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
  },
  statsBox: {
    alignItems: 'center',
  },
  statsCount: {
    color: '#fff',
    fontSize: 22,
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
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  musicInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  musicInfoTitle: {
    color: '#888',
    fontSize: 14,
    marginLeft: 10,
  },
  musicInfoValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: '#FF6F61',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activitySection: {
    marginBottom: 100, // Added bottom margin for scrolling past bottom nav
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  activityPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 20,
  },
  noActivityText: {
    color: '#888',
    fontSize: 18,
    marginTop: 15,
    fontWeight: '500',
  },
  activitySubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
});

export default ProfileScreen;