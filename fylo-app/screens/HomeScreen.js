import { useState, useContext } from 'react';
import { Button, SafeAreaView, Modal, TextInput, Text, Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { AuthContext } from '../contexts/AuthContext';
import { SessionsContext } from '../contexts/SessionsContext';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createSession } from '../utils/Sessions';
import { searchUsers, addFriend } from '../utils/Users';

const HomeScreen = ({ navigation, sessions, user }) => {
    const { signOut, refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    
    const [createSessionModalVisible, setCreateSessionModalVisible] = useState(false);
    const [sessionName, setSessionName] = useState(null);
    const [cameraType, setCameraType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const handleSignOut = () => {
        signOut();
    }

    const handleSessionCreation = async () => {
        const newSession = await createSession(user._id, sessionName);
        user.sessions.push(newSession._id);
        navigation.navigate('SessionsNavigator', {screen: 'Sessions'})
        setCreateSessionModalVisible(false);
        refreshUser(user.username);
        reloadSessions(user.sessions);

    }

    const handlePictureTake = async () => {
        const photo = await Camera.takePictureAsync();
        console.log(photo);
    }

    return (
        <SafeAreaView style={styles.container}>
            {user.hasActiveSession ? (
                <Text style={{fontSize: 20}}>You have an ongoing session!</Text>
            ) : (
                <>
                    <Button title="Start Session" onPress={() => setCreateSessionModalVisible(true)} />
                    <Modal
                        animationType="slide"
                        visible={createSessionModalVisible}
                    >
                        <SafeAreaView style={styles.container}>
                            <Text>Session Name</Text>
                            <TextInput style={styles.input} onChangeText={(text) => setSessionName(text)} />
                            <Button title="Cancel" onPress={() => setCreateSessionModalVisible(false)} />
                            <Button title="Create" onPress={handleSessionCreation} />
                        </SafeAreaView>
                    </Modal>
                </>
            )}
            <Button title="Sign Out" onPress={handleSignOut} />
            {/* <Camera style={{flex: 1, alignItems: "center", justifyContent: "flex-end", width: Dimensions.get('window').width, height: Dimensions.get('window').height}} type={cameraType}>
                <View style={{
                    width: 75, 
                    height: 75, 
                    borderBottomRightRadius: "50%",
                    borderBottomLeftRadius: "50%",
                    borderTopLeftRadius: "50%",
                    borderTopRightRadius: "50%",
                    borderTopWidth: 6,
                    borderRightWidth: 6,
                    borderBottomWidth: 6,
                    borderLeftWidth: 6,
                    borderColor: "white",
                    backgroundColor: "transparent",
                    marginBottom: 64
                }}>
                    <TouchableOpacity onPress={handlePictureTake}>
                    </TouchableOpacity>
                </View>
            </Camera> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // margin: 8
    },
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        margin: 8,
        padding: 8,
        fontSize: 16
    },
    text: {
        fontSize: 20
    }
});

export default HomeScreen;