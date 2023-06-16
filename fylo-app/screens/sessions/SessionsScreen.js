import { Button, View, SafeAreaView, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import SessionListItem from  '../../components/SessionListItem';
import { AntDesign } from '@expo/vector-icons'; 

const SessionsScreen = ({ navigation, sessions, user }) => {
    return (
        <SafeAreaView style={{flex: 1, alignItems: "center"}}>
            {/* <View style={styles.header}>
                <Image style={styles.logo} source={require('../../assets/logo-black.png')} />
            </View> */}
            <View style={styles.sessionsContainer}>
                {sessions.map(session => {
                    return <SessionListItem 
                        sessionName={session.name} 
                        numContributors={session.contributors.length}
                        button={<AntDesign name="select1" size={24} color="black" />}
                        handler={() => navigation.navigate(session._id)} 
                        key={session._id} 
                    />
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    sessionsContainer: {
        width: "85%"
    }
});

export default SessionsScreen;