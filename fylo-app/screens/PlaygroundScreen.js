import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import SessionListItem from '../components/SessionListItem';
import { getPendingIncomingSessionInvites } from '../utils/Sessions';

const PlaygroundScreen = ({user, sessions}) => {
    const [sessionInvites, setSessionInvites] = useState([]);

    useEffect(() => {
        const getInvites = async () => {
            const invites = await getPendingIncomingSessionInvites(user._id);

            setSessionInvites(invites);
        };

        getInvites();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={styles.header}>
                <Image style={styles.logo} source={require('../assets/logo-black.png')} />
            </View> */}
            <View style={styles.infoContainer}>
                <View style={styles.initialsContainer}>
                    <Text style={styles.initials}>GO</Text>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.fullName}>{user.fullName}</Text>
                    <Text style={styles.username}>{user.username}</Text>
                </View>
            </View>
            <View style={styles.sessionInvitesContainer}>
                <Text style={styles.sessionInvitesTitle}>SESSION INVITES</Text>
                <ScrollView horizontal={true} scrollEnabled={false} contentContainerStyle={{width: "100%"}}>
                    <FlatList 
                        data={sessionInvites}
                        renderItem={({item: { session }}) => <SessionListItem sessionName={session.name} numContributors={session.contributors.length} /> }
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
        marginLeft: 50
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