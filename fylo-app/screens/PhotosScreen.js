import { useEffect, useState } from 'react';
import { SafeAreaView, Button, Image, Alert } from 'react-native';
import { fetchAllPhotos, uploadPhoto } from '../utils/S3Client';
import * as ImagePicker from 'expo-image-picker';

// TODO: It's slow for some reason

const PhotosScreen = ({ session, user }) => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        loadPhotos();
    }, []);

    const loadPhotos = async () => {
        const loadedPhotos = await fetchAllPhotos(session._id);
        setPhotos(loadedPhotos);
    }

    const handlePhotoUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "Images",
            aspect: [4, 3],
            quality: 1,
          });
          
          if (!result.canceled) {
            try {
                const key = await uploadPhoto(session._id, result.assets[0].uri, user.username);
                loadPhotos();
                return Alert.alert('Photo uploaded!');
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
                await uploadPhoto(session._id, result.assets[0].uri, user.username);
                return Alert.alert('Photo uploaded!');
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <SafeAreaView>
            <Button title="Upload Photo" onPress={handlePhotoUpload} />
            <Button title="Take Picture" onPress={handlePictureTake} />
            {photos.map(photo => {
                return <Image style={{width: 75, height: 75}} key={photo.key} source={{uri: photo.img}} />
            })}
        </SafeAreaView>
    )
}

export default PhotosScreen;