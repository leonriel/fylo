import { useState, useContext } from 'react';
import { Button, SafeAreaView, Modal, TextInput, Text, View, Dimensions, Pressable, StyleSheet } from 'react-native';
// import { Camera, CameraType } from 'expo-camera';
import CameraComponent from '../components/CameraComponent';
import { AuthContext } from '../contexts/AuthContext';
import { SessionsContext } from '../contexts/SessionsContext';
import { createSession } from '../utils/Sessions';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileIcon from '../components/ProfileIcon';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import { Ionicons } from '@expo/vector-icons'; 
import Input from '../components/Input';

const HomeScreen = ({ navigation, sessions, user }) => {
    const { signOut, refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    
    const [createSessionModalVisible, setCreateSessionModalVisible] = useState(false);
    const [sessionName, setSessionName] = useState(null);


    const handleSessionCreation = async () => {
        const newSession = await createSession(user._id, sessionName);
        user.sessions.push(newSession._id);
        navigation.navigate('Sessions Navigator', {screen: 'Sessions'})
        setCreateSessionModalVisible(false);
        refreshUser(user.username);
        reloadSessions(user.sessions);

    }

    return (
        <View style={{flex: 1}}>
            {/* <LinearGradient colors={["#5DC3CC", "#A39C83", "#E8763A"]} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}> */}
                <SafeAreaView style={styles.container}>
                    {/* <View style={styles.header}>
                        <Pressable onPress={() => navigation.jumpTo("Playground")}>
                            <ProfileIcon firstName={user.firstName} lastName={user.lastName} />
                        </Pressable>
                        <Image style={styles.logo} source={require('../assets/logo-black.png')} />
                        <Pressable onPress={() => navigation.jumpTo("Sessions Navigator")}>
                            <Ionicons name="albums-outline" size={24} color="black" />                        
                        </Pressable>
                    </View> */}
                    <View style={{flex: 1}}>
                        {user.hasActiveSession ? (
                            // <Text style={styles.text}>You have an ongoing session!</Text>
                            <View style={{flex: 1, marginTop: 10}}>
                                <CameraComponent />
                            </View>
                        ) : (
                            <>
                                <View style={styles.startSessionContainer}>
                                    <Text style={styles.startSessionText}>Start</Text>
                                    <Pressable onPress={() => setCreateSessionModalVisible(true)}>
                                        <View style={styles.startSessionButton}>
                                            <FastImage style={styles.icon} source={require('../assets/icon-grey.png')} />
                                        </View>
                                    </Pressable>
                                    <Text style={styles.startSessionText}>Session</Text>
                                </View>
                                <Modal
                                    animationType="slide"
                                    visible={createSessionModalVisible}
                                >
                                    <SafeAreaView style={styles.modal}>
                                        <Text>Session Name</Text>
                                        <Input width="80%" label="Session Name" value={sessionName} handler={(text) => setSessionName(text)} />
                                        <Button title="Create" onPress={handleSessionCreation} />
                                        <Button title="Cancel" onPress={() => setCreateSessionModalVisible(false)} />
                                    </SafeAreaView>
                                </Modal>
                            </>
                        )}
                    </View>
                </SafeAreaView>
            {/* </LinearGradient> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        alignSelf: "center", 
        width: "90%"
    },
    input: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 5,
        margin: 8,
        padding: 8,
        fontSize: 16
    },
    text: {
        fontSize: 20
    },
    startSessionContainer: {
        alignSelf: "center",
        alignItems: "center"
    },
    startSessionText: {
        fontSize: 24,
        fontFamily: "Quicksand-SemiBold"
    },
    startSessionButton: {
        height: 150,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 75, // Half of 150; "50%" does not make a circle for some reason
        justifyContent: "center",
        alignItems: "center"
    },
    logo: {
        height: 25, 
        aspectRatio: "228/76" 
    },
    icon: {
        height: 75, 
        aspectRatio: "86/84" 
    },
    text: {
        fontFamily: "Quicksand-Regular",
        fontSize: 20,
        alignSelf: "center"
    },
    modal: {
        flex: 1,
        alignItems: "center", 
        justifyContent: "center"
    }
});

export default HomeScreen;