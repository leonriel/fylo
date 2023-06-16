import { useEffect, useState, useContext } from 'react';
import { SafeAreaView, FlatList, View, TouchableOpacity, Button, Alert, Modal, StyleSheet, TextInput, Text } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { endSession } from '../../utils/Sessions';
import { AuthContext } from '../../contexts/AuthContext';
import { SessionsContext } from '../../contexts/SessionsContext';
import { searchUsers } from '../../utils/Users';
import Input from '../../components/Input';
import UserListItem from '../../components/UserListItem';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

const PhotosScreen = ({ navigation, session, user }) => {
    const { refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    const [photos, setPhotos] = useState([]);
    const [actionsModalVisible, setActionsModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Actions" onPress={() => setActionsModalVisible(true)} />
            )
        })
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const { results } = await Storage.list(`${session._id}/`, { pageSize : 'ALL' })
        const calls = results.map(async (res) => {
            try {
                let photo = await Storage.get(res.key, { 
                    download: true,
                    progressCallback: (progress) => {
                        console.log(progress.loaded / progress.total)
                    } 
                });
                photo = await blobToBase64(photo.Body);
                return photo;
            } catch (error) {
                console.log(error);
            }
        })

        let images;
        try {
            images = await Promise.all(calls)
        } catch (error) {
            console.log(error);
        }

        const imgComponents = images.map((photo, index) => {
            return ({
                id: index,
                uri: photo
            })
        })

        setPhotos(imgComponents);
    }

    const handlePhotoUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
          
        if (!result.canceled) {
            try {
                const resp = await fetch(result.assets[0].uri);
                const blob = await resp.blob();
                const fileName = Date.now() + uuidv4();
                const { key } = Storage.put(`${session._id}/${fileName}`, blob, {
                    contentType: "image/jpeg",
                    resumable: true,
                    completeCallback: async (event) => {
                        const uri = await blobToBase64(blob);
                        setPhotos((currentPhotos) => {
                            return ([
                                ...currentPhotos,
                                {
                                    id: currentPhotos.length,
                                    uri: uri
                                }
                            ])
                        })
                        Alert.alert("Photo uploaded!");
                    }
                });

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
                const resp = await fetch(result.assets[0].uri);
                const blob = await resp.blob();
                const fileName = Date.now() + uuidv4();
                const { key } = Storage.put(`${session._id}/${fileName}`, blob, {
                    contentType: "image/jpeg",
                    resumable: true,
                    completeCallback: async (event) => {
                        const uri = await blobToBase64(blob);
                        setPhotos((currentPhotos) => {
                            return ([
                                ...currentPhotos,
                                {
                                    id: currentPhotos.length,
                                    uri: uri
                                }
                            ])
                        })
                        Alert.alert("Photo uploaded!");
                    }
                });

            } catch (error) {
                console.error(error);
            }
        }
    }

    const handleSearchUsers = async (query) => {
        const searchedUsers = await searchUsers(query);

        setSearchedUsers(searchedUsers);
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
                    if (user._id != session.owner) {
                        return Alert.alert("User does not have permission to end this session.")
                    }
                    const data = await endSession(user._id, session);
                    reloadSessions(user.sessions);
                    refreshUser(user.username);
                }
            }
        ] )
    )

    const blobToBase64 = (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
    };

    const Photo = ({ uri, id }) => {
        let gap;
        if (id % 4 != 3) {
            gap = {paddingRight: 1}
        }

        return (
            <TouchableOpacity style={{flex: 1, aspectRatio: 1, minWidth: "25%", maxWidth: "25%", ...gap}}>
                <Image style={{height: "100%", width: "100%"}} source={{uri: uri}} /> 
            </TouchableOpacity> 
        )
    }

    return (
            <SafeAreaView style={{flex: 1}}>
                <View style={{width: "100%", flex: 4, justifyContent: "center", alignSelf: "center"}}>
                    <FlatList 
                        data={photos}
                        renderItem={({item}) => {
                            return <Photo uri={item.uri} id={item.id} />
                        }}
                        keyExtractor={(item) => item.id}
                        numColumns={4}
                        ItemSeparatorComponent={() => <View style={{height: 1}} />}
                        // key={4}
                        refreshing={true}
                    />
                </View>
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
                                        <Input label="Search" width="80%" handler={(text) => handleSearchUsers(text)} />
                                        {searchedUsers ? searchedUsers.map(searchedUser => (
                                            <UserListItem key={searchedUser.username} firstName={searchedUser.firstName} lastName={searchedUser.lastName} fullName={searchedUser.fullName} username={searchedUser.username} />
                                        )) : null}
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
        borderWidth: 1,
        margin: 8,
        padding: 8,
        fontSize: 16
    },
    text: {
        fontSize: 20
    }
});

export default PhotosScreen;