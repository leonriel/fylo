import { useEffect, useState } from 'react';
import { Modal, FlatList, View, Dimensions, Pressable, Alert, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Entypo, Feather } from '@expo/vector-icons';
import { v4 as uuidv4 } from 'uuid';
import * as MediaLibrary from 'expo-media-library';

// offset is a react ref from PhotosScreen.js
const PhotoCarousel = ({photos, visible, handleClose, offset}) => {
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

    const totalItemWidth = Dimensions.get('window').width + 20

    // SHARESHEET ERRORS!!!!! >:(
    const handleShare = async (uri) => {
        try {
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
            Alert.alert(error.message);
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

            const downloadPath = `${FileSystem.cacheDirectory}${uuidv4()}.jpeg`;
            const { uri: localUrl } = await FileSystem.downloadAsync(
                uri,
                downloadPath
            );

            await MediaLibrary.saveToLibraryAsync(localUrl);

            Alert.alert("Saved!")
        } catch (error) {
            console.log(error.message);
        }
    }

    const CarouselPhoto = ({uri}) => {
        const [width, setWidth] = useState(null);
        const [height, setHeight] = useState(null);

        return (
            <View style={styles.mediaContainer}>
                <FastImage 
                    resizeMode={FastImage.resizeMode.contain} 
                    style={{width: "100%", aspectRatio: height && width ? `${width}/${height}` : 'auto'}} 
                    source={{uri: uri}} 
                    onLoad={(e) => {
                        setWidth(e.nativeEvent.width);
                        setHeight(e.nativeEvent.height);
                    }}
                />
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
                        <Pressable onPress={handleClose}>
                            <Ionicons name="chevron-down" size={30} color="black" />
                        </Pressable>
                        <View style={styles.actions}>
                            <Pressable onPress={async () => {
                                const index = offset.current;
                                const photo = photos[index];
                                await handleShare(photo.uri);
                            }}>
                                <Entypo name="share" size={24} style={{marginRight: 10}} color="black" />     
                            </Pressable>
                            <Pressable onPress={async () => {
                                const index = offset.current;
                                const photo = photos[index];
                                await handleDownload(photo.uri)
                            }}>
                                <Feather name="download" size={24} color="black" />                       
                            </Pressable>
                        </View>

                    </View>
                    <FlatList
                        data={photos}
                        renderItem={({item}) => {
                            return (
                                <CarouselPhoto uri={item.uri} />
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