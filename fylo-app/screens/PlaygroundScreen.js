import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType, Video} from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, Pressable, View, ImageBackground } from 'react-native';
import { Entypo } from '@expo/vector-icons';

let camera = Camera

const PlaygroundScreen = ({user, sessions}) => {
    const [type, setType] = useState(CameraType.back);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [image, setImage] = useState(null);
    const [hasAudioPermission, setHasAudioPermission] = useState(null);
    const [record, setRecord] = useState(null);
    const [status, setStatus] = useState({})
    
    useEffect(() => {
        (async () =>{
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const audioStatus = await Camera.requestMicrophonePermissionsAsync();
            setHasAudioPermission(cameraStatus.status === 'granted');
        })()
    }, []);

    const Button = ({onPress, icon, color, size, text, margin}) => {
        return(
            <Pressable onPress={onPress} style={{...styles.button, margin: margin}}>
                <Entypo name={icon} color = {color} size = {size} />
                <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: "#fff"}}>{text}</Text>
            </Pressable>
        )
    }

    const VideoButton = ({onPress, icon, color, size, text, margin, onLongPress, onPressOut}) => {
        return(
            <Pressable onPress={onPress} onLongPress={onLongPress} onPressOut={onPressOut} style={{...styles.button, margin: margin}}>
                <Entypo name={icon} color = {color} size = {size} />
                <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: "#fff"}}>{text}</Text>
            </Pressable>
        )
    }

    const takePicture = async () => {
        if (!camera) return;
        try{
            const photo = await camera.takePictureAsync()
            console.log(photo)
            setImage(photo.uri)
        } catch (error) {
            console.warn(error)
        }
    }

    const takeVideo = async () => {
        if (!camera) return;
        try{
            const video = await camera.recordAsync({maxDuration: 15})
            console.log(video)
            setRecord(video.uri)
        } catch (error) {
            console.warn(error)
        }
    }

    const stopVideo = async () => {
        if (!camera) return;
        try{
            camera.stopRecording()
        } catch (error) {
            console.warn(error)
        }
    }

    if(hasCameraPermission === null){
        return
    }
    
    if(hasCameraPermission === false || hasAudioPermission === false){
        return(
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 30}}>Enable camera and microphone access to take photos and videos</Text>
        </View>
        )
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
    
    return (
        <View style = {styles.container}>
            if(!image && !record){
                <Camera style={styles.camera} type={type} flashMode={flash} ref={(r) => {camera = r}}>
                    <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', margin: 30}}>
                        <Button icon='flash' size='30' color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'} 
                        onPress={() => {setFlash(flash === Camera.Constants.FlashMode.off ? 
                            Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)}}/>
                        <Button onPress={toggleCameraType} icon='swap' color='#fff' size='30' margin={10}/>
                    </View>
                    <View style = {styles.buttonContainer}>
                        {/* <Button onPress={takePicture} icon='circle' color ='#fff' size='80' margin={10} /> */}
                        <VideoButton onPress={takePicture} onLongPress={takeVideo} onPressOut={stopVideo} icon='circle' color ='#fff' size='80' margin={10} />
                    </View>
                </Camera>
            } else if (image) {
                <View style={styles.camera}>
                    <ImageBackground source={{uri: image}} style={styles.camera}>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => {setImage(null)}} icon='retweet' color='#fff' size='30' text='Retake?'/>
                        </View>
                    </ImageBackground>
                </View>
            } else if (record) {
                <View style={styles.camera}>
                    {/* <Video 
                        ref={record} 
                        style={styles.camera} 
                        source={{uri: record}} 
                        useNativeControls 
                        resizeMode='contain' 
                        isLooping
                        onPlaybackStatusUpdate={status => (setStatus(()=>status))}
                    />  */}
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },

    camera: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end'
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        flexDirection: 'row',
    },

    buttonContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }

});

export default PlaygroundScreen;