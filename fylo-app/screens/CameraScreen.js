import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { Video, ResizeMode } from 'expo-av';
// import VideoPlayer from 'expo-video-player';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useState, useEffect, useRef, useContext } from 'react';
import { StyleSheet, Text, Pressable, View, Alert, ImageBackground } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { uploadPhoto } from '../utils/Sessions';
import { SessionsContext } from '../contexts/SessionsContext';

let camera = Camera

const CameraScreen = ({ user, sessions, handleClose }) => {
    const { reloadSessions } = useContext(SessionsContext)

    const [type, setType] = useState(CameraType.back);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [image, setImage] = useState(null);
    const [aspectRatio, setAspectRatio] = useState('3/4');
    const [videoMode, setVideoMode] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [videoStatus, setVideoStatus] = useState({});
    
    const video = useRef(null);
    
    useEffect(() => {
        (async () =>{
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(audioStatus.status === 'granted');
        })()
    }, []);

    const Button = ({onPress, icon, color, size, text, margin}) => {
        return(
            <Pressable onPress={onPress} style={{...styles.button, margin: margin}}>
                <Entypo name={icon} color={color} size={size} />
            </Pressable>
        )
    }

    const takePicture = async () => {
        if (!camera) return;
        try {
            const photo = await camera.takePictureAsync()
            setImage(photo.uri)
        } catch (error) {
            console.log(error);
        }
    }

    const startVideo = async () => {
        if (!camera) return;
        try {
            setIsRecording(true);
            const video = await camera.recordAsync()
            setImage(video.uri);
        } catch (error) {
            console.log(error);
        }
    }

    const stopVideo = async () => {
        try {
            await camera.stopRecording();
        } catch (error) {
            console.log(error);
        } finally {
            setIsRecording(false);
        }
    }

    if (hasCameraPermission === null) {
        return
    }

    if (hasAudioPermission === null) {
        return
    }
    
    if (hasCameraPermission === false) {
        return(
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 40}}>Enable camera access to take photos and videos.</Text>
        </View>
        )
    }

    if (hasAudioPermission === false) {
        return(
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 40}}>Enable audio permission to take photos and videos.</Text>
        </View>
        )
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const handlePhotoUpload = async () => {
        try {
            if (!user.hasActiveSession) {
                throw new Error("No active session to upload to.");
            }
            const activeSession = sessions.filter(session => session.isActive)[0]

            const resp = await fetch(image);
            const blob = await resp.blob();
            const contentType = videoMode ? 'video' : 'image'
            let thumbnail;
            if (contentType == "video") {
                thumbnail = await VideoThumbnails.getThumbnailAsync(image);
                thumbnail = await fetch(thumbnail);
                thumbnail = await thumbnail.blob();
            }
            await uploadPhoto(activeSession, blob, user, contentType, thumbnail).then(async (resp) => {
                reloadSessions(user.sessions);
            });

            Alert.alert('Uploaded!');
        } catch (error) {
            Alert.alert(error.message);
        } finally {
            setImage(null);
        }
    }

    const AspectRatioButton = ({ratio, handlePress}) => {
        const ratios = {
            '3/4': '4:3',
            '9/16': '16:9',
            '1': '1:1'
        }

        return (
            <Pressable onPress={handlePress} style={{justifyContent: "center", alignItems: "center", height: 30, width: 30, borderRadius: 15, backgroundColor: "gray", marginLeft: 'auto'}}>
                <Text style={{fontFamily: "Quicksand-Regular", fontSize: 15, color: "white"}}>{ratios[ratio]}</Text>
            </Pressable>
        )
    }

    return (
        <View style={{height: "100%"}}>
            {aspectRatio == '3/4' && <View style={styles.header}>
                <Pressable onPress={handleClose} style={({pressed}) => pressed && {opacity: 0.5}}>
                    <Ionicons name="chevron-down" size={30} color="white" />
                </Pressable>
            </View>}
            <View style = {styles.container}>
                {!image ? (
                    <Camera 
                        style={{...styles.camera, aspectRatio: aspectRatio}}
                        type={type}
                        flashMode={flash}
                        ref={(r) => {camera = r}}
                    >
                        <View style={{...styles.header}}>
                            {aspectRatio == '9/16' && <Pressable onPress={handleClose} style={({pressed}) => pressed && {opacity: 0.5}}>
                                <Ionicons name="chevron-down" size={30} color="white" />
                            </Pressable>}
                            {aspectRatio == '3/4' && <AspectRatioButton ratio={aspectRatio} handlePress={() => setAspectRatio('9/16')} />}
                            {aspectRatio == '9/16' && <AspectRatioButton ratio={aspectRatio} handlePress={() => setAspectRatio('3/4')} />}
                        </View>
                    </Camera>) : (
                        videoMode ? (
                            <Video
                                ref={video}
                                style={{...styles.camera, aspectRatio: aspectRatio}}
                                source={{uri: image}}
                                useNativeControls
                                shouldPlay
                                resizeMode={ResizeMode.CONTAIN}
                                onPlaybackStatusUpdate={(status) => setVideoStatus(() => status)}
                            />
                            // <VideoPlayer 
                            //     videoProps={{
                            //         useNativeControls: true,
                            //         style: {...styles.camera, aspectRatio: aspectRatio},
                            //         shouldPlay: true,
                            //         resizeMode: ResizeMode.CONTAIN,
                            //         source: {uri: image}
                            //     }}
                            // />
                        ) : (
                        <ImageBackground source={{uri: image}} style={{...styles.camera, aspectRatio: aspectRatio}} />
                        )
                )}
            </View>
            {!image && (
                <View style={styles.buttonContainer}> 
                    <Button icon='flash' size={30} color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'} 
                        onPress={() => {setFlash(flash === Camera.Constants.FlashMode.off ? 
                            Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                        )}}
                    />
                    {
                        videoMode ? (
                            <Button onPress={() => isRecording ? stopVideo() : startVideo()} icon={isRecording ? 'controller-stop' : 'controller-record'} size={80} color='white' />
                        ) : (
                            <Button onPress={takePicture} icon='circle' color ='white' size={80} />
                        )
                    }
                    <Button onPress={toggleCameraType} icon='cycle' color='#fff' size={30} />   
                </View>
            )}
            <View style={styles.footer}>
                {!image ? (
                    <>
                        <View style={{flex: 1, justifyContent: "flex-start"}} >
                            <Pressable onPress={() => {setAspectRatio('3/4'); setVideoMode(false)}} style={[{height: "50%", margin: 5, justifyContent: "center", alignItems: "center", borderRadius: 10}, !videoMode && {backgroundColor: "#E8763A"}]}>
                                <Button icon='image' size={30} color='white' onPress={() => {setAspectRatio('3/4'); setVideoMode(false)}} />
                            </Pressable>
                        </View>
                        <View style={{flex: 1, justifyContent: "flex-start"}} >
                            <Pressable onPress={() => {setAspectRatio('9/16'); setVideoMode(true)}} style={[{height: "50%", margin: 5, justifyContent: "center", alignItems: "center", borderRadius: 10}, videoMode && {backgroundColor: "#E8763A"}]}>
                                <Button icon='video' size={30} color='white' onPress={() => {setAspectRatio('9/16'); setVideoMode(true)}} />
                            </Pressable>
                        </View>
                    </>) : (
                    <>
                        <Pressable style={{flex: 1, justifyContent: "flex-start"}} onPress={() => setImage(null)}>
                            <View style={{height: "50%", backgroundColor: "#E8763A", margin: 5, justifyContent: "center", alignItems: "center", borderRadius: 10}}>
                                <Text style={{fontSize: 15, fontFamily: "Quicksand-SemiBold", color: "white"}}>Retake</Text>
                            </View>
                        </Pressable>
                        <Pressable style={{flex: 1, justifyContent: "flex-start"}} onPress={handlePhotoUpload}>
                            <View style={{height: "50%", backgroundColor: "#E8763A", margin: 5, justifyContent: "center", alignItems: "center", borderRadius: 10}}>
                                <Text style={{fontSize: 15, fontFamily: "Quicksand-SemiBold", color: "white"}}>Upload</Text>
                            </View>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        overflow: "hidden",
        borderColor: "orange",
        borderWidth: 2
    },
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        alignSelf: "center", 
        width: "95%",
        height: 40
    },
    camera: {
        width: '100%'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonContainer: {
        width: "80%",
        position: 'absolute',
        bottom: 120,
        alignSelf: "center",
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    footer: {
        height: "10%", 
        backgroundColor: "powderblue", 
        width: "100%", 
        borderRadius: 10, 
        marginTop: 'auto',
        flexDirection: "row", 
        justifyContent: "space-between",
        overflow: "hidden"
    }
});

export default CameraScreen;