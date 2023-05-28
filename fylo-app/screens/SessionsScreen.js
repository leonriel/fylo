import { Button, SafeAreaView } from 'react-native';

const SessionsScreen = ({ navigation, sessions, user }) => {
    return (
        <SafeAreaView>
            {sessions.map(session => {
                return <Button title={session.name} key={session._id} onPress={() => navigation.navigate(session._id)} />
            })}
        </SafeAreaView>
    );
}

export default SessionsScreen;