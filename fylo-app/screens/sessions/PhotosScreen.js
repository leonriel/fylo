import { useEffect, useState, useContext, useRef } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { FlatList, View, Button, Alert, Modal, StyleSheet, Pressable, Text, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker';
import { endSession, uploadPhoto } from '../../utils/Sessions';
import { AuthContext } from '../../contexts/AuthContext';
import { SessionsContext } from '../../contexts/SessionsContext';
import { searchUsers } from '../../utils/Users';
import Input from '../../components/Input';
import UserListItem from '../../components/UserListItem';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { CLOUDFRONT_DOMAIN } from '@env';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import PhotoCarousel from '../../components/PhotoCarousel';

// TODO: Camera
// TODO: Integrate Create Session Modal 6/30
// TODO: Redesign session "settings" 6/30
// TODO: Allow users to edit profile page 6/30
// TODO: Find a way to make FlatList gap logic less hacky 6/30
// TODO: App flow??
// TODO: Navigation Tab Bar?
// TODO: Friends?

const PhotosScreen = ({ navigation, session, user }) => {
    const { refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    const [photos, setPhotos] = useState([]);
    const [actionsModalVisible, setActionsModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const offset = useRef(0);

    useEffect(() => {
        navigation.setOptions({
            header: ({navigation}) => {
                return <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={30} color="black" />
                    </Pressable>
                    <Text style={{fontFamily: "Quicksand-Bold", fontSize: 20}}>{session.name}</Text>
                    <Pressable onPress={() => setActionsModalVisible(true)}>
                        <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
                    </Pressable>
                </View>
            },
            headerStyle: {
                height: 30
            },
        })
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const numPhotos = session.photos.length;
        FastImage.preload(session.photos.map((photo) => {
            return {uri: `${CLOUDFRONT_DOMAIN}/public/${photo.key}`}
        }));

        const imgComponents = session.photos.map((photo, index) => {
            const url = `${CLOUDFRONT_DOMAIN}/public/${photo.key}`
            return ({
                id: numPhotos - index,
                uri: url
            })
        });

        setPhotos(imgComponents);

    }

    const handlePhotoUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1
        });
          
        if (!result.canceled) {
            try {
                const resp = await fetch(result.assets[0].uri);
                const blob = await resp.blob();
                setActionsModalVisible(false);
                setActivityIndicator(true);
                await uploadPhoto(session, blob, user).then(async (resp) => {
                    const uri = await blobToBase64(blob);
                    setPhotos((currentPhotos) => [{
                        id: currentPhotos.length + 1,
                        uri: uri
                    },
                    ...currentPhotos])
                    reloadSessions(user.sessions);
                    Alert.alert("Image uploaded!");
                });
            } catch (error) {
                console.error(error);
            } finally {
                setActivityIndicator(false);
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
        Alert.alert("Are you sure?", "This is a permanent action and cannot be undone.", [
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

    const handleOpenCarousel = async (index) => {
        offset.current = index;
        setModalVisible(true);
    }

    const Photo = ({ uri, id, index }) => {
        let gap;
        const numPhotos = photos.length;
        if (numPhotos % 4 == 0 && id % 4 != 0) {
            gap = {paddingLeft: 1}
        }

        if (numPhotos % 4 == 1 && id % 4 != 1) {
            gap = {paddingLeft: 1}
        }

        if (numPhotos % 4 == 2 && id % 4 != 2) {
            gap = {paddingLeft: 1}
        }

        if (numPhotos % 4 == 3 && id % 4 != 3) {
            gap = {paddingLeft: 1}
        }

        return (
            <Pressable onPress={() => handleOpenCarousel(index)} style={{flex: 1, aspectRatio: 1, minWidth: Dimensions.get('window').width / 4, maxWidth: Dimensions.get('window').width / 4, ...gap}}>
                <FastImage style={{height: "100%", width: "100%"}} source={{uri: uri}} /> 
            </Pressable> 
        )
    }

    return (
        <View style={{flex: 1}}>
            {activityIndicator && <ActivityIndicator />} 
            <View style={{width: "100%", flex: 4, justifyContent: "center", alignSelf: "center"}}>
                <FlatList 
                    data={photos}
                    renderItem={({item, index}) => {
                        return <Photo uri={item.uri} id={item.id} index={index} />
                    }}
                    keyExtractor={(item) => item.id}
                    numColumns={4}
                    ItemSeparatorComponent={() => <View style={{height: 1}} />}
                    refreshing={true}
                    scrollEnabled={true}
                />
            </View>
            <PhotoCarousel visible={modalVisible} photos={photos} handleClose={() => setModalVisible(false)} offset={offset} />
            <Modal
                animationType="slide"
                visible={actionsModalVisible}
                onRequestClose={() => setActionsModalVisible(false)}
            >
                <SafeAreaProvider>
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
                </SafeAreaProvider>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 8
    },
    header: {
        width: "100%", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        alignSelf: "center",
        marginVertical: 10
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