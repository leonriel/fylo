import { useEffect, useState, useRef, useContext } from 'react';
import { Modal, FlatList, View, Dimensions, Pressable, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
// import { Image } from 'expo-image';
import { Video, ResizeMode } from 'expo-av';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import * as MediaLibrary from 'expo-media-library';
import { deletePhoto } from '../../utils/Sessions';
import { SessionsContext } from '../../contexts/SessionsContext';

// offset is a react ref from PhotosScreen.js
const PhotoCarousel = ({user, session, photos, visible, handleClose, offset, loadPhotos}) => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const [activityIndicator, setActivityIndicator] = useState(false);

    const { reloadSessions } = useContext(SessionsContext);

    const totalItemWidth = Dimensions.get('window').width + 20

    // SHARESHEET ERRORS!!!!! >:(
    const handleShare = async (uri) => {
        try {
            setActivityIndicator(true);
            const downloadPath = `${FileSystem.cacheDirectory}${uuidv4()}.jpeg`;
            const { uri: localUrl } = await FileSystem.downloadAsync(
                uri,
                downloadPath
            );
            const available = await Sharing.isAvailableAsync()
            if (available) {
                Sharing.shareAsync(localUrl, {
                    UTI: "JPEG",
                    mimeType: "image/jpeg"
                });
            }
        } catch (error) {
            Alert.alert("Oh no, there's been an error! Please try again.");
        } finally {
            setActivityIndicator(false);
        }
    }

    const handleDownload = async (uri) => {
        try {
            if (!permissionResponse.granted) {
                const result = await requestPermission();
                if (!result.granted) {
                    Alert.alert("Unable to save media to your device.");
                    throw new Error('Invalid permissions.');
                }
            }

            setActivityIndicator(true);

            const downloadPath = `${FileSystem.cacheDirectory}${uuidv4()}.jpeg`;
            const { uri: localUrl } = await FileSystem.downloadAsync(
                uri,
                downloadPath
            );

            await MediaLibrary.saveToLibraryAsync(localUrl);

            Alert.alert("Saved!")
        } catch (error) {
            console.log(error.message);
            Alert.alert("Oh no, there's been an error! Please try again.");
        } finally {
            setActivityIndicator(false);
        }
    }

    const handleDelete = async (key) => {
        try {
            setActivityIndicator(true);
            await deletePhoto(session, key, user);
        } catch (error) {
            Alert.alert(error.response.data.message);
        } finally {
            setActivityIndicator(false);
            await reloadSessions(user.sessions);
            await loadPhotos();
            handleClose();
        }
    }

    const CarouselPhoto = ({uri, type}) => {
        const [width, setWidth] = useState(null);
        const [height, setHeight] = useState(null);
        const [videoStatus, setVideoStatus] = useState(null);
        const video = useRef(null);

        return (
            <View style={styles.mediaContainer}>
                {type == "image" && 
                <FastImage 
                    resizeMode={FastImage.resizeMode.contain} 
                    style={{width: "100%", aspectRatio: height && width ? `${width}/${height}` : 'auto'}} 
                    source={{uri: uri}} 
                    onLoad={(e) => {
                        setWidth(e.nativeEvent.width);
                        setHeight(e.nativeEvent.height);
                    }}
                />}
                {type == "video" &&
                <Video
                    ref={video}
                    style={{width: "100%", aspectRatio: height && width ? `${width}/${height}` : 'auto'}} 
                    source={{uri: uri}}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={(status) => setVideoStatus(() => status)}
                    onReadyForDisplay={({naturalSize}) => {
                        setWidth(naturalSize.width);
                        setHeight(naturalSize.height);
                    }}
                />
                }
            </View>
        )
    }

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={handleClose}
        >
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.header}>
                        <Pressable onPress={handleClose} style={({pressed}) => pressed && {opacity: 0.5}}>
                            <Ionicons name="chevron-down" size={30} color="black" />
                        </Pressable>
                        <View style={styles.actions}>
                            <Pressable 
                                onPress={async () => {
                                    const index = offset.current;
                                    const photo = photos[index];
                                    await handleShare(photo.uri);
                                }}
                                style={({pressed}) => pressed && {opacity: 0.5}}
                            >
                                <Entypo name="share" size={24} style={{marginRight: 10}} color="black" />     
                            </Pressable>
                            <Pressable 
                                onPress={async () => {
                                    const index = offset.current;
                                    const photo = photos[index];
                                    await handleDownload(photo.uri)
                                }}
                                style={({pressed}) => pressed && {opacity: 0.5}}
                            >
                                <Feather name="download" size={24} color="black" />                       
                            </Pressable>
                            <Pressable 
                                onPress={async () => {
                                    const index = offset.current;
                                    const photo = photos[index];
                                    await handleDelete(photo.key)
                                }}
                                style={[{marginLeft: 10}, ({pressed}) => pressed && {opacity: 0.5}]}
                            >
                                <Feather name="trash-2" size={24} color="red" />                       
                            </Pressable>
                        </View>

                    </View>
                    {activityIndicator && <ActivityIndicator />}
                    <FlatList
                        data={photos}
                        renderItem={({item}) => {
                            return (
                                <CarouselPhoto uri={item.uri} type={item.type} />
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{width: 20}} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate="fast"
                        snapToInterval={totalItemWidth}
                        disableIntervalMomentum
                        contentOffset={{x: totalItemWidth * offset.current, y: 0}}
                        getItemLayout={(data, index) => ({
                            length: totalItemWidth,
                            offset: totalItemWidth * index,
                            index
                        })}
                        onScroll={(e) => offset.current = e.nativeEvent.contentOffset.x / totalItemWidth}
                    />
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "95%", 
        justifyContent: "space-between", 
        alignItems: "center", 
        height: 30, 
        flexDirection: "row", 
        alignSelf: "center"
    },
    actions: {
        flexDirection: "row", 
        alignItems: "center"
    },
    mediaContainer: {
        height: "100%", 
        width: Dimensions.get('window').width, 
        justifyContent: "center"
    }
})

export default PhotoCarousel;