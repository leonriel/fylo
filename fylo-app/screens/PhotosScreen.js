import { useEffect, useState, useContext } from 'react';
import { SafeAreaView, Button, Alert, Modal, StyleSheet, TextInput, Text } from 'react-native';
import { Image } from 'expo-image';
import { fetchAllPhotos, uploadPhoto } from '../utils/S3Client';
import * as ImagePicker from 'expo-image-picker';
import { endSession } from '../utils/Sessions';
import { AuthContext } from '../contexts/AuthContext';
import { SessionsContext } from '../contexts/SessionsContext';
import { searchUsers } from '../utils/Users';

// TODO: It's slow for some reason

const PhotosScreen = ({ navigation, session, user }) => {
    const { refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    const [photos, setPhotos] = useState([]);
    const [actionsModalVisible, setActionsModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Actions" onPress={() => setActionsModalVisible(true)} />
            )
        })
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const loadedPhotos = await fetchAllPhotos(session._id);
        const imgComponents = loadedPhotos.map(photo => {
            return <Image style={{width: 75, height: 75}} key={photo.key} source={{uri: photo.img}} />
        })
        setPhotos(imgComponents);
    }

    const handlePhotoUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            aspect: [4, 3],
            quality: 1,
          });
          
          if (!result.canceled) {
            try {
                const key = await uploadPhoto(session._id, result.assets[0].uri, user.username);
                loadPhotos();
                return Alert.alert('Photo uploaded!');
            } catch (error) {
                console.error(error);
            }
          }
    }

    const handlePictureTake = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            return Alert.alert("Unable to take a picture. Please check your permissions.");
        }

        let result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            try {
                await uploadPhoto(session._id, result.assets[0].uri, user.username);
                return Alert.alert('Photo uploaded!');
            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleSearchFriends = async (query) => {
        const searchedUsers = await searchUsers(query);

        const searchedFriends = searchedUsers.filter(searchedUser => user.friends.includes(searchedUser.username));

        setFriends(searchedFriends);
    }

    const handleEndSession = async () => (
        Alert.alert("Are you sure?", "This is a permanent action and connot be undone.", [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'End',
                onPress: async () => {
                    const data = await endSession(user.username, session);
                    reloadSessions(user.sessions);
                    refreshUser(user.username);
                }
            }
        ] )
    )

    return (
        <SafeAreaView>
            {photos}
            <Modal
                animationType="slide"
                visible={actionsModalVisible}
                onRequestClose={() => setActionsModalVisible(false)}
            >
                <SafeAreaView style={styles.container}>
                        {session.isActive ? (
                        <>
                            <Button title="Upload Photo" onPress={handlePhotoUpload} />
                            <Button title="Take Picture" onPress={handlePictureTake} />
                            <Button title="Invite" onPress={() => setInviteModalVisible(true)} />
                            <Modal
                                animationType="slide"
                                visible={inviteModalVisible}
                                onRequestClose={() => setInviteModalVisible(false)}
                            >
                                <SafeAreaView style={styles.container}>
                                    <TextInput style={styles.input} onChangeText={(text) => handleSearchFriends(text)} />
                                    {friends.map(friend => <Text key={friend.username} style={styles.text}>{friend.firstName + " " + friend.lastName}</Text>)}
                                    <Button title="Close" onPress={() => setInviteModalVisible(false)} />
                                </SafeAreaView>
                            </Modal>
                            <Button title="End Session" onPress={handleEndSession} />
                        </>
                    ) : null}
                    <Button title="Close" onPress={() => setActionsModalVisible(false)} />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 8
    },
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        margin: 8,
        padding: 8,
        fontSize: 16
    },
    text: {
        fontSize: 20
    }
});

export default PhotosScreen;