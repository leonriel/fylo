import { useEffect, useState, useContext, useRef } from 'react';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { FlatList, View, Alert, Modal, StyleSheet, Pressable, Text, ActivityIndicator, Dimensions, TextInput, Keyboard, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video, ResizeMode } from 'expo-av';
import { endSession, uploadPhoto, getPendingOutgoingSessionInvites, sendSessionInvite, cancelSessionInvite } from '../../utils/Sessions';
import { AuthContext } from '../../contexts/AuthContext';
import { SessionsContext } from '../../contexts/SessionsContext';
import { getUsers, searchUsers } from '../../utils/Users';
import Input from '../../components/Input';
import UserListItem from '../../components/UserListItem';
import Button from '../../components/Button';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';
import { CLOUDFRONT_DOMAIN } from '@env';
import { MaterialCommunityIcons, Ionicons, AntDesign, Entypo} from '@expo/vector-icons';
import PhotoCarousel from './PhotoCarouselScreen';

// TODO: Display video thumbnail? Find a way to keep track of file type... and maybe video length? Probably through MongoDB... will also need to kepe track of file types from local library 1
// TODO: Allow users to edit profile page 6/30 2
// TODO: Reset password 3
// TODO: Select images mode 4
// TODO: Notifications 5

const PhotosScreen = ({ navigation, session, user }) => {
    const { refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);

    const [photos, setPhotos] = useState([]);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [pendingOutgoingInvites, setPendingOutgoingInvites] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [friends, setFriends] = useState([]);
    const [focused, setFocused] = useState(false);
    const [refreshingPhotos, setRefreshingPhotos] = useState(false);
    const [refreshingInvitees, setRefreshingInvitees] = useState(false);
    const [refreshingCollaborators, setRefreshingCollaborators] = useState(false);

    const searchBar = useRef(null);
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
        loadFriends();
    }, []);

    const loadPhotos = async () => {
        const numPhotos = session.photos.length;

        const imgComponents = session.photos.map((photo, index) => {
            const url = `${CLOUDFRONT_DOMAIN}/public/${photo.key}`;
            const type = photo.type;

            let thumbnail;
            if (type == "video") {
                thumbnail = `${CLOUDFRONT_DOMAIN}/public/${photo.thumbnail}`
            }

            return ({
                id: numPhotos - index,
                uri: url,
                type: photo.type,
                thumbnail: thumbnail
            })
        });

        setPhotos(imgComponents);
    }

    const loadOutgoingInvitations = async () => {
        const invitations = await getPendingOutgoingSessionInvites(session._id);

        const recipients = invitations.map(invitation => invitation.recipient);

        setPendingOutgoingInvites(recipients);
    }

    const loadCollaborators = async () => {
        const members = await getUsers(session.contributors);

        setCollaborators(members);
    }

    const loadFriends = async () => {
        const friends = await getUsers(user.friends);

        setFriends(friends);
    }

    const handlePhotoUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1
        });

          
        if (!result.canceled) {
            try {
                const photo = result.assets[0];
                let contentType;
                if (photo.type == "image" || photo.type == "video") {
                    contentType = photo.type;
                } else {
                    return Alert.alert("Please choose an image or video.");
                }
                const resp = await fetch(photo.uri);
                const blob = await resp.blob();
                setInfoModalVisible(false);
                setActivityIndicator(true);
                let thumbnail;
                if (contentType == "video") {
                    thumbnail = await VideoThumbnails.getThumbnailAsync(photo.uri);
                    thumbnail = await fetch(thumbnail.uri);
                    thumbnail = await thumbnail.blob();
                }
                await uploadPhoto(session, blob, user, contentType, thumbnail).then(async (resp) => {
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
                Alert.alert("Oh no, there's been an error! Please try again.");
            } finally {
                setActivityIndicator(false);
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

    const handleSendSessionInvite = async (recipientId) => {
        try {
            await sendSessionInvite(user._id, recipientId, session._id);
            loadOutgoingInvitations();
        } catch (error) {
            console.log(error);
            Alert.alert(error.message);
        }

    }

    const handleCancelInvite = async (recipientId) => {
        try {
            await cancelSessionInvite(user._id, recipientId, session._id);
            loadOutgoingInvitations();
        } catch (error) {
            console.log(error);
            Alert.alert(error.message);
        }
    }

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

    const Photo = ({ uri, id, index, type, thumbnail }) => {
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

        const displayImage = thumbnail ? thumbnail : uri;

        return (
            <Pressable onPress={() => handleOpenCarousel(index)} style={{flex: 1, aspectRatio: 1, minWidth: Dimensions.get('window').width / 4, maxWidth: Dimensions.get('window').width / 4, ...gap}}>
                <FastImage style={{height: "100%", width: "100%"}} source={{uri: displayImage}} />
            </Pressable> 
        )
    }

    const handleCancelSearch = async () => {
        Keyboard.dismiss();
        searchBar.current.clear();
        setSearchedUsers([]);
        setFocused(false);
    }

    const handleRefreshPhotos = async () => {
        setRefreshingPhotos(true);
        setTimeout(async () => {
            await refreshUser(user.username);
            await reloadSessions(user.sessions);
            await loadPhotos();
            setRefreshingPhotos(false);
        }, 1000);
    }

    const handleRefreshInvitees = async () => {
        setRefreshingInvitees(true)
        setTimeout(async () => {
            await refreshUser(user.username);
            await reloadSessions(user.sessions);
            await loadOutgoingInvitations();
            await loadCollaborators();
            await loadFriends();
            setRefreshingInvitees(false);
        }, 1000);
    }

    const handleRefreshCollaborators = async () => {
        setRefreshingCollaborators(true);
        setTimeout(async () => {
            await refreshUser(user.username);
            await reloadSessions(user.sessions);
            await loadCollaborators();
            setRefreshingCollaborators(false);
        }, 1000);
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
                                return <Photo uri={item.uri} id={item.id} index={index} type={item.type} thumbnail={item.thumbnail} />
                            }}
                            keyExtractor={(item) => item.id}
                            numColumns={4}
                            ItemSeparatorComponent={() => <View style={{height: 1}} />}
                            refreshing={true}
                            scrollEnabled={true}
                            contentContainerStyle={{height: "100%"}}
                            refreshControl={<RefreshControl refreshing={refreshingPhotos} onRefresh={handleRefreshPhotos} />}
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
                        <Text style={{fontSize: 30, fontFamily: "Quicksand-SemiBold", marginBottom: 5}}>{session.name}</Text>
                        <Text style={{fontSize: 20, fontFamily: "Quicksand-Regular", marginBottom: 10}}>{session.photos.length} Photos</Text>
                        <View style={{width: "90%"}}>
                            <Text style={{fontSize: 12, fontFamily: "Quicksand-SemiBold"}}>COLLABORATORS</Text>
                            <ScrollView
                                style={{height: "100%"}}
                                refreshControl={<RefreshControl refreshing={refreshingCollaborators} onRefresh={handleRefreshCollaborators} />}
                            >
                                <View style={{marginBottom: 20}}>
                                    <FlatList
                                        data={collaborators}
                                        renderItem={({item}) => <UserListItem 
                                            firstName={item.firstName} 
                                            lastName={item.lastName} 
                                            fullName={item.fullName} 
                                            username={item.username} 
                                            button={
                                                session.owner == item._id ? (
                                                    <Text style={{fontSize: 10, fontFamily: "Quicksand-Regular", color: "gray"}}>Owner</Text>
                                                ) : null}
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
                            </ScrollView>
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
                        <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 24, marginBottom: 20}}>Invite Collaborators</Text>
                        <View style={styles.searchComponent}>
                            <View style={styles.searchBarContainer}>
                                <Entypo name="magnifying-glass" size={24} color="black" />
                                <TextInput 
                                    autoCorrect={false}
                                    clearButtonMode={'while-editing'}
                                    ref={input => {searchBar.current = input}}
                                    style={styles.searchBar} 
                                    placeholder="Search for collaborators"
                                    placeholderTextColor='gray'
                                    onChangeText={(text) => handleSearchUsers(text)}
                                    onFocus={() => setFocused(true)}
                                />
                            </View>
                            {focused && <View style={styles.cancelSearch}>
                                <Button 
                                    borderRadius={20}
                                    backgroundColor="#E8763A"
                                    height={25}
                                    aspectRatio="3/1"
                                    fontFamily="Quicksand-SemiBold"
                                    fontColor="white"
                                    fontSize={15}
                                    text="Cancel"
                                    handler={handleCancelSearch}
                                />
                            </View>}
                        </View>
                        {/* <Input label="Search" width="90%" placeholder="Search for collaborators" handler={(text) => handleSearchUsers(text)} /> */}
                        <ScrollView
                            contentContainerStyle={{height: "100%", width: "100%", alignItems: "center"}}
                            keyboardShouldPersistTaps='handled'
                            refreshControl={<RefreshControl refreshing={refreshingInvitees} onRefresh={handleRefreshInvitees} />}
                        >
                            <View style={{width: "90%", marginTop: 20}}>
                                <Text style={{fontFamily: "Quicksand-Bold", fontSize: 12}}>INVITED</Text>
                                <FlatList 
                                    // data={collaborators.concat(pendingOutgoingInvites)}
                                    data={pendingOutgoingInvites}
                                    renderItem={({ item }) => (
                                        <UserListItem 
                                            firstName={item.firstName} 
                                            lastName={item.lastName} 
                                            fullName={item.fullName} 
                                            username={item.username} 
                                            button={() => {
                                                // if (collaborators.some(collaborator => collaborator.username == item.username)) {
                                                //     return (<Button 
                                                //         borderRadius={20}
                                                //         backgroundColor="#E8763A"
                                                //         height={25}
                                                //         aspectRatio="3/1"
                                                //         fontFamily="Quicksand-SemiBold"
                                                //         fontColor="white"
                                                //         fontSize={15}
                                                //         text="Joined"
                                                //     />)
                                                // } else {
                                                    return (<Pressable onPress={() => handleCancelInvite(item._id)}>
                                                        <Entypo name="cross" size={16} color="gray" />
                                                    </Pressable>)
                                                // }
                                            }}
                                        />
                                    )}
                                    keyExtractor={(item) => item.username}
                                    scrollEnabled={false}
                                    keyboardShouldPersistTaps='handled'
                                />
                            </View>
                            <View style={{width: "90%", marginTop: 20}}>
                                <Text style={{fontFamily: "Quicksand-Bold", fontSize: 12}}>FRIENDS</Text>
                                <FlatList 
                                    data={friends}
                                    renderItem={({ item }) => <UserListItem 
                                        firstName={item.firstName} 
                                        lastName={item.lastName} 
                                        fullName={item.fullName} 
                                        username={item.username} 
                                        button={() => {
                                            if (pendingOutgoingInvites.some(invite => invite.username == item.username)) {
                                                return <Button 
                                                    borderRadius={20}
                                                    backgroundColor="#E8763A"
                                                    height={25}
                                                    aspectRatio="3/1"
                                                    fontFamily="Quicksand-SemiBold"
                                                    fontColor="white"
                                                    fontSize={15}
                                                    text="Invited"
                                                />
                                            } else if (collaborators.some(collaborator => collaborator.username == item.username)) {
                                                return <Button 
                                                    borderRadius={20}
                                                    backgroundColor="#E8763A"
                                                    height={25}
                                                    aspectRatio="3/1"
                                                    fontFamily="Quicksand-SemiBold"
                                                    fontColor="white"
                                                    fontSize={15}
                                                    text="Joined"
                                                />
                                            } else {
                                                return <Button 
                                                    borderRadius={20}
                                                    backgroundColor="#E8763A"
                                                    height={25}
                                                    aspectRatio="3/1"
                                                    fontFamily="Quicksand-SemiBold"
                                                    fontColor="white"
                                                    fontSize={15}
                                                    text="Invite"
                                                    handler={() => handleSendSessionInvite(item._id)}
                                                />
                                            }
                                        }}
                                    />}
                                    keyExtractor={(item) => item.username}
                                    scrollEnabled={false}
                                    keyboardShouldPersistTaps='handled'
                                />
                            </View>
                        </ScrollView>
                        <View 
                            style={{
                                backgroundColor: "white", 
                                width: "90%", 
                                alignSelf: "center", 
                                shadowOffset: { width: 0, height: 5 }, 
                                shadowOpacity: 0.5,
                                shadowRadius: 5,
                                borderRadius: 10,
                                position: 'absolute', 
                                top: "26%",
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
                                    button={() => {
                                        if (pendingOutgoingInvites.some(invite => invite.username == item.username)) {
                                            return <Button 
                                                borderRadius={20}
                                                backgroundColor="#E8763A"
                                                height={25}
                                                aspectRatio="3/1"
                                                fontFamily="Quicksand-SemiBold"
                                                fontColor="white"
                                                fontSize={15}
                                                text="Invited"
                                        />
                                        } else if (collaborators.some(collaborator => collaborator.username == item.username)) {
                                            return <Button 
                                                borderRadius={20}
                                                backgroundColor="#E8763A"
                                                height={25}
                                                aspectRatio="3/1"
                                                fontFamily="Quicksand-SemiBold"
                                                fontColor="white"
                                                fontSize={15}
                                                text="Joined"
                                            />
                                        } else {
                                            return <Button 
                                                borderRadius={20}
                                                backgroundColor="#E8763A"
                                                height={25}
                                                aspectRatio="3/1"
                                                fontFamily="Quicksand-SemiBold"
                                                fontColor="white"
                                                fontSize={15}
                                                text="Invite"
                                                handler={() => handleSendSessionInvite(item._id)}
                                            />
                                        }
                                    }}
                                />}
                                keyExtractor={(item) => item.username}
                                keyboardShouldPersistTaps='handled'
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
    searchComponent: {
        width: "90%",
        alignSelf: "center",
        flexDirection: "row"
    },
    searchBarContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems:"center",
        alignSelf: "center",
        flex: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 40,
        overflow: "hidden",
    },
    searchBar: {
        width: "90%", 
        height: "100%", 
        fontSize: 20, 
        fontFamily: "Quicksand-Regular", 
        paddingHorizontal: 5
    },
    cancelSearch: {
        alignSelf: "center",
        marginLeft: 10
    },
    text: {
        fontSize: 20
    }
});

export default PhotosScreen;