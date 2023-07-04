import { useEffect, useState, useContext, useRef } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { FlatList, View, Alert, Modal, StyleSheet, Pressable, Text, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker';
import { endSession, uploadPhoto, getPendingOutgoingSessionInvites } from '../../utils/Sessions';
import { AuthContext } from '../../contexts/AuthContext';
import { SessionsContext } from '../../contexts/SessionsContext';
import { getUsers, searchUsers } from '../../utils/Users';
import Input from '../../components/Input';
import UserListItem from '../../components/UserListItem';
import Button from '../../components/Button';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { CLOUDFRONT_DOMAIN } from '@env';
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import PhotoCarousel from './PhotoCarouselScreen';

// TODO: Camera
// TODO: Allow users to edit profile page 6/30
// TODO: Should the camera really be the first screen?
// TODO: App flow??
// TODO: Friends?
// TODO: Notifications

const PhotosScreen = ({ navigation, session, user }) => {
    const { refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);

    const [photos, setPhotos] = useState([]);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [pendingOutgingInvites, setPendingOutgoingInvites] = useState([]);
    const [collaborators, setCollaborators] = useState([]);

    const offset = useRef(0);

    useEffect(() => {
        navigation.setOptions({
            header: ({navigation}) => {
                return <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={({pressed}) => [pressed && {opacity: 0.5}, {flex: 1}]}>
                        <Ionicons name="chevron-back-outline" size={30} color="black" />
                    </Pressable>
                    <Pressable onPress={() => setInfoModalVisible(true)} style={({pressed}) => [pressed && {opacity: 0.5}, {flex: 6, flexDirection: "row", justifyContent: "flex-start"}]}>
                        <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 24}}>{session.name}</Text>
                    </Pressable>
                    <View style={{flexDirection: "row", alignItems: "center", flex: 2, justifyContent: "flex-end"}}>
                        {session.isActive && (
                            <>
                                <Pressable onPress={() => setInviteModalVisible(true)} style={({pressed}) => [pressed && {opacity: 0.5}]}>
                                    <AntDesign name="adduser" size={24} color="black" />
                                </Pressable>
                                <Pressable onPress={handlePhotoUpload} style={({pressed}) => [pressed && {opacity: 0.5}, {marginLeft: 5}]}>
                                    <AntDesign name="plus" size={24} color="black" />
                                </Pressable>
                            </>
                        )}

                    </View>
                </View>
            },
            headerStyle: {
                height: 30
            },
        })
        loadPhotos();
        loadOutgoingInvitations();
        loadCollaborators();
    }, []);

    const loadPhotos = async () => {
        const numPhotos = session.photos.length;

        const imgComponents = session.photos.map((photo, index) => {
            const url = `${CLOUDFRONT_DOMAIN}/public/${photo.key}`
            return ({
                id: numPhotos - index,
                uri: url
            })
        });

        setPhotos(imgComponents);
    }

    const loadOutgoingInvitations = async () => {
        const invitations = await getPendingOutgoingSessionInvites(session._id);

        setPendingOutgoingInvites(invitations);
    }

    const loadCollaborators = async () => {
        const members = await getUsers(session.contributors);

        setCollaborators(members);
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
                setInfoModalVisible(false);
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
            {photos.length > 0 ? (
                <>
                    <View style={{width: "100%", justifyContent: "center", alignSelf: "center"}}>
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
                </>
            ) : <Text style={{fontSize: 16, fontFamily: "Quicksand-Regular", alignSelf: "center"}}>This session has no photos!</Text>}
            <Modal
                animationType="slide"
                visible={infoModalVisible}
                onRequestClose={() => setInfoModalVisible(false)}
            >
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Pressable onPress={() => {
                                    setInfoModalVisible(false);
                                }} 
                                style={({pressed}) => [pressed && {opacity: 0.5}, {flex: 1}]}
                            >
                                <Ionicons name="chevron-down-outline" size={30} color="black" />
                            </Pressable>
                        </View>
                        <Text style={{fontSize: 30, fontFamily: "Quicksand-SemiBold", marginBottom: 10}}>{session.name}</Text>
                        <View style={{width: "90%"}}>
                            <Text style={{fontSize: 10, fontFamily: "Quicksand-SemiBold"}}>COLLABORATORS</Text>
                            <View style={{marginBottom: 10}}>
                                <FlatList
                                    data={collaborators}
                                    renderItem={({item}) => <UserListItem 
                                        firstName={item.firstName} 
                                        lastName={item.lastName} 
                                        fullName={item.fullName} 
                                        username={item.username} 
                                        button={session.owner == item._id ? <Text style={{fontSize: 10, fontFamily: "Quicksand-Regular", color: "gray"}}>Owner</Text> : null}
                                    />}
                                    keyExtractor={(item) => item.username}
                                    scrollEnabled={false}
                                />
                            </View>
                            {session.owner == user._id && session.isActive ? <Button 
                                borderRadius={20}
                                backgroundColor="#E8763A"
                                height={25}
                                width="90%"
                                fontFamily="Quicksand-SemiBold"
                                fontColor="white"
                                fontSize={15}
                                text="END SESSION"
                                handler={handleEndSession}
                            /> : null }
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
            <Modal
                animationType="slide"
                visible={inviteModalVisible}
                onRequestClose={() => setInviteModalVisible(false)}
            >
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Pressable onPress={() => {
                                    setInviteModalVisible(false);
                                    setSearchedUsers([]);
                                }} 
                                style={({pressed}) => [pressed && {opacity: 0.5}, {flex: 1}]}
                            >
                                <Ionicons name="chevron-down-outline" size={30} color="black" />
                            </Pressable>
                        </View>
                        <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 24}}>Invite Collaborators</Text>
                        <Input label="Search" width="80%" placeholder="Search for collaborators" handler={(text) => handleSearchUsers(text)} />
                        <View style={{width: "80%", marginTop: 10}}>
                            <Text style={{fontFamily: "Quicksand-Bold", fontSize: 10}}>INVITED</Text>
                            <FlatList 
                                data={pendingOutgingInvites}
                                renderItem={({ item: { recipient } }) => <UserListItem firstName={recipient.firstName} lastName={recipient.lastName} fullName={recipient.fullName} username={recipient.username} />}
                                keyExtractor={({ recipient }) => recipient.username}
                            />
                        </View>
                        <View 
                            style={{
                                backgroundColor: "white", 
                                width: "80%", 
                                alignSelf: "center", 
                                shadowOffset: { width: 0, height: 5 }, 
                                shadowOpacity: 0.5,
                                shadowRadius: 5,
                                borderRadius: 10,
                                position: 'absolute', 
                                top: "25%",
                                paddingHorizontal: 10
                            }}
                        >
                            <FlatList
                                data={searchedUsers}
                                renderItem={({item}) => <UserListItem 
                                    firstName={item.firstName} 
                                    lastName={item.lastName} 
                                    fullName={item.fullName} 
                                    username={item.username}
                                />}
                                keyExtractor={(item) => item.username}
                                // ItemSeparatorComponent={() => <View style={{backgroundColor: "black", height: 1, opacity: 0.5}} />}
                                contentContainerStyle={{
                                    
                                }}
                            />
                        </View>
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        width: "95%", 
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