import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, Pressable, View, SafeAreaView, ImageBackground } from 'react-native';
import { Entypo } from '@expo/vector-icons';

let camera = Camera

const CameraComponent = () => {
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
            <Pressable onPress={onPress} style={{...styles.button, margin: margin}}>
                <Entypo name={icon} color={color} size={size} />
                <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 20, color: "#fff"}}>{text}</Text>
            </Pressable>
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
        <SafeAreaView style={{flex: 1}}>
            <View style = {styles.container}>
                {!image ?
                <Camera 
                    style={styles.camera}
                    type={type}
                    flashMode={flash}
                    ref={(r) => {camera = r}}
                >
                    <View style={{flex: 1, alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between', margin: 30}}>
                        <Button icon='flash' size={30} color={flash === Camera.Constants.FlashMode.off ? 'gray' : 'white'} 
                        onPress={() => {setFlash(flash === Camera.Constants.FlashMode.off ? 
                            Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off
                        )}}
                        />
                        <Button onPress={toggleCameraType} icon='swap' color='#fff' size={30} /> 
                    </View>
                </Camera> :
                <View style={styles.camera}>
                    <ImageBackground source={{uri: image}} style={styles.camera}>
                        <View style={styles.buttonContainer}>
                            <Button onPress={() => {setImage(null)}} icon='retweet' color='#fff' size={30} text='Retake?'/>
                        </View>
                    </ImageBackground>
                </View>
                }
            </View>
            <View style = {styles.buttonContainer}> 
                <Button onPress={takePicture} icon='circle' color ='black' size={80} />    
            </View> 
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 30,
        aspectRatio: "3/4"
    },

    camera: {
        width: '100%',
        justifyContent: 'flex-end',
        // borderRadius: "20%",
        aspectRatio: "3/4"
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

export default CameraComponent;