import { Pressable, View, SafeAreaView, StyleSheet } from 'react-native';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
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
                        button1={<Pressable onPress={() => navigation.navigate(session._id)}>
                            <AntDesign name="select1" size={24} color="black" style={{marginLeft: "auto"}} />
                        </Pressable>}
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