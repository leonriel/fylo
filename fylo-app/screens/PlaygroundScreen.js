import { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import SessionListItem from '../components/SessionListItem';
import { getPendingIncomingSessionInvites } from '../utils/Sessions';
import Button from '../components/Button';
import { Entypo } from '@expo/vector-icons';
import { ignoreSessionInvite, acceptSessionInvite } from '../utils/Sessions';
import { AuthContext } from '../contexts/AuthContext';
import { SessionsContext } from '../contexts/SessionsContext';

const PlaygroundScreen = ({navigation, user, sessions}) => {
    const { signOut, refreshUser } = useContext(AuthContext);
    const { reloadSessions } = useContext(SessionsContext);
    
    const [sessionInvites, setSessionInvites] = useState([]);

    useEffect(() => {
        getInvites();
    }, []);

    const getInvites = async () => {
        const invites = await getPendingIncomingSessionInvites(user._id);

        setSessionInvites(invites);
    };

    const acceptInvite = async (senderId, recipientId, session) => {
        try {
            await acceptSessionInvite(senderId, recipientId, session);
            await getInvites();
            await refreshUser(user.username);
            user.sessions.push(session);
            await reloadSessions(user.sessions);
            navigation.jumpTo("Sessions Navigator");
        } catch (error) {
            Alert.alert(error.response.data);
        }
    }

    const ignoreInvite = async (senderId, recipientId, session) => {
        await ignoreSessionInvite(senderId, recipientId, session);
        await getInvites();
    }

    const handleSignOut = () => {
        signOut();
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
                <Image style={styles.logo} source={require('../assets/logo-black.png')} />
            </View> */}
            <View style={styles.infoContainer}>
                <View style={styles.initialsContainer}>
                    <Text style={styles.initials}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.fullName}>{user.fullName}</Text>
                    <Text style={styles.username}>{user.username}</Text>
                    <Button 
                        borderRadius="25%" 
                        backgroundColor="#E8763A" 
                        height={25} aspectRatio="3/1" 
                        fontFamily="Quicksand-SemiBold" 
                        fontSize={12}
                        marginTop={10}
                        fontColor="white"
                        text="SIGN OUT"
                        handler={handleSignOut} />
                </View>
            </View>
            <View style={styles.sessionInvitesContainer}>
                <Text style={styles.sessionInvitesTitle}>SESSION INVITES</Text>
                <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={{width: "100%"}}>
                    <FlatList 
                        data={sessionInvites}
                        renderItem={({item: { session }}) => <SessionListItem 
                            sessionName={session.name} 
                            numContributors={session.contributors.length} 
                            button1={<Button 
                                borderRadius="25%"
                                backgroundColor="#E8763A"
                                height={25}
                                marginRight={10}
                                aspectRatio="8/3"
                                fontFamily="Quicksand-SemiBold"
                                fontColor="white"
                                fontSize={12}
                                text="ACCEPT"
                                handler={() => acceptInvite(session.sender, user._id, session._id)}
                            />}
                            button2={<Pressable onPress={() => ignoreInvite(session.sender, user._id, session._id)}>
                                <Entypo name="cross" size={16} color="gray" />
                            </Pressable>}
                        />}
                        keyExtrator={item => item.session._id}
                    />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center"
    },
    header: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",
        alignSelf: "center", 
        width: "90%"
    },
    logo: {
        height: 25, 
        aspectRatio: "228/76" 
    },
    infoContainer: {
        flex: 1,
        width: "85%",
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center"
    },
    initialsContainer: {
        borderWidth: 1, 
        borderColor: "black", 
        borderRadius: "50%", 
        height: 75, 
        width: 75, 
        justifyContent: "center", 
        alignItems: "center"
    }, 
    initials: {
        fontFamily: "Quicksand-SemiBold",
        fontSize: 36
    },
    nameContainer: {
        marginLeft: 50,
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
    fullName: {
        fontFamily: "Quicksand-Regular",
        fontSize: 24
    },
    username: {
        fontFamily: "Quicksand-Regular",
        fontSize: 16,
        color: "gray"
    },
    sessionInvitesTitle: {
        fontFamily: "Quicksand-Bold",
        fontSize: 12,
        alignSelf: "flex-start"
    },
    sessionInvitesContainer: {
        flex: 4,
        alignItems: "center",
        width: "85%",
        alignSelf: "center"
    },
})

export default PlaygroundScreen;