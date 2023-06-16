import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { Entypo } from '@expo/vector-icons';

let camera: Camera

const PlaygroundScreen = ({user, sessions}) => {
    const [type, setType] = useState(CameraType.back);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [image, setImage] = useState(null);
    
    useEffect(() => {
        (async () =>{
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })()
    }, []);

    const Button = ({onPress, icon, color, size, text, margin}) => {
        return(
            <TouchableOpacity onPress={onPress} style={{...styles.button, margin: margin}}>
                <Entypo name={icon} color = {color} size = {size} />
                <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: '20', color: "#fff"}}>{text}</Text>
            </TouchableOpacity>
        )
    }

    const takePicture = async () => {
        if (!camera) return;
        const photo = await camera.takePictureAsync()
        console.log(photo)
        setImage(photo.uri)
    }

    if(hasCameraPermission === null){
        return
    }
    
    if(hasCameraPermission === false){
        return(
        <View style={styles.container}>
            <Text style={{textAlign: 'center', fontSize: 40}}>Enable camera access to take photos</Text>
        </View>
        )
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <View style = {styles.container}>
            {!image ?
            <Camera 
                style={styles.camera}
                type={type}
                flashMode={flash}
                ref={(r) => {camera = r}}
            >
                <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 30, marginLeft: 30}}>
                    <Button icon = 'flash' size = '30' color = {flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'} 
                    onpress={() => {setFlash(flash === Camera.Constants.FlashMode.off ? 
                        Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                    )}}
                    />
                </View>
                <View style = {styles.buttonContainer}>
                    <Button onPress={toggleCameraType} icon = 'swap' color = '#fff' size='30' margin={10} />  
                    <Button onPress={takePicture} icon = 'camera' color ='#fff' size='50' margin={10} />    
                </View> 
            </Camera> :
            <View style={styles.camera}>
                <ImageBackground source={{uri: image}} style={styles.camera}>
                    <View style={styles.buttonContainer}>
                        <Button onPress={() => {setImage(null)}} icon = 'retweet' color = '#fff' size = '30' text = 'Retake?'/>
                    </View>
                </ImageBackground>
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