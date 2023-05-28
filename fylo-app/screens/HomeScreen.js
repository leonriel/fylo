import { useState, useContext } from 'react';
import { Button, SafeAreaView, Modal, TextInput, Text, Alert, Image, StyleSheet } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { SessionsContext } from '../contexts/SessionsContext';
import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createSession } from '../utils/Sessions';

// TODO: Create flow so that users create an session, click sessions, and display the photos in the sessions

// TODO: Find a good way to dynamically add photos to the UI without doing something hacky

// TODO: Find a way to only display the photos when they've all been loaded... not any of this weird laggy stuff
//       although we will want to load images to the UI lazily... using FlatList or something

const HomeScreen = ({ navigation, sessions, user }) => {
    const { signOut, refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    
    const [createSessionModalVisible, setCreateSessionModalVisible] = useState(false);

    const [sessionName, setSessionName] = useState(null);

    const handleSignOut = () => {
        signOut();
    }

    const handleSessionCreation = async () => {
        const newUser = await createSession(user.username, sessionName);

        setCreateSessionModalVisible(false);
        reloadSessions(newUser.sessions);
        refreshUser(user.username);
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
            
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 8
    },
    input: {
        width: '80%',
        borderBottomWidth: 2,
        margin: 8,
        padding: 2,
        fontSize: 16
    }
});

export default HomeScreen;