import { useState, useEffect } from 'react';
import { Text, StyleSheet, SafeAreaView, TextInput, Alert, View, Image, Keyboard, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Custom button for the accept button, allows me to create the pill shape border.
const CustomButton = ({ title, color, onPress }) => (
    <TouchableOpacity style={[styles.acceptContainer, { backgroundColor: color }]} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const PlaygroundScreen = ({ user, sessions }) => {

    const [pendingIncoming, setPendingIncoming] = useState([]);

    useEffect(() => {
        // Get all the sessions the user has been invited to.
        const loadPendingIncoming = async () => {
            const pendingInc = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/getPendingIncoming", {
                recipient: user._id
            });
            setPendingIncoming(pendingInc.data);
        }
        loadPendingIncoming();
    }, [user]);

    console.log(pendingIncoming);

    // Handle accept button press
    const handleAccept = async (pendingSessionInvite) => {
        try {
            const acceptInc = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/accept", {
                sender: pendingSessionInvite.session.sender,
                recipient: pendingSessionInvite._id,
                session: pendingSessionInvite.session._id
            });

            // Once the accept request is successful, remove the invite from the display
            setPendingIncoming((pendingIncoming) =>
                pendingIncoming.filter((invite) => invite !== pendingSessionInvite)
            );
        } catch (error) {
            Alert.alert(error.response.data);
            // Alert.alert('You can only be in one session at a time!');
        }
    };

    // Handle decline button press
    const handleDecline = async (pendingSessionInvite) => {
        const declineInc = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/setStatusIgnored", {
            sender: pendingSessionInvite.sender,
            recipient: pendingSessionInvite.recipient,
            session: pendingSessionInvite.session
        });

        // Once the decline request is successful, remove the invite from the display
        setPendingIncoming((pendingIncoming) =>
            pendingIncoming.filter((invite) => invite !== pendingSessionInvite)
        );
    };

    return (
        <View style={styles.pageContainer}>
            <Text style={styles.pageTitle}>SESSION INVITES</Text>
            {pendingIncoming.map((pendingSessionInvite) => (
                <View key={pendingSessionInvite.session.name} style={styles.invContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.sessionName}>{pendingSessionInvite.session.name}</Text>
                        <Text style={styles.numContributors}>{pendingSessionInvite.session.contributors.length} contributors</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <CustomButton title="ACCEPT" color="orange" onPress={() => handleAccept(pendingSessionInvite)} />
                        <TouchableOpacity onPress={() => handleDecline(pendingSessionInvite)} style={styles.declineButton}>
                            <Image source={require('./x-button.png')} style={styles.xButtonImage} />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flexDirection: 'column',
        backgroundColor: 'fff',
        paddingTop: 40
    },
    invContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8
    },
    textContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    pageTitle: {
        fontFamily: "Quicksand-Bold",
        color: 'black',
        fontSize: 16,
        paddingLeft: 8,
        marginLeft: 8,
        marginBottom: 8
    },
    sessionName: {
        fontFamily: "Quicksand-Bold",
        color: 'black',
        fontSize: 20,
        paddingLeft: 8,
        marginLeft: 8,
    },
    numContributors: {
        fontFamily: "Quicksand-Regular",
        fontWeight: "bold",
        color: 'gray',
        fontSize: 12,
        paddingLeft: 8,
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    acceptContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        width: 80,
        height: 25,
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginRight: 8,
    },
    buttonText: {
        fontFamily: "Quicksand-Bold",
        color: 'white',
        fontSize: 16,
    },
    xButtonImage: {
        width: 12,
        height: 12,
    },
    declineButton: {
        marginRight: 8,
    },
});

export default PlaygroundScreen;