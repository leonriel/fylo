import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text } from 'react-native';
import SessionsScreen from './SessionsScreen';
import PhotosScreen from './PhotosScreen';

const SessionsNavigator = ({ navigation, sessions, user }) => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen name="Sessions" children={(props) => <SessionsScreen {...props} sessions={sessions} user={user} />} />
            {sessions.map(session => {
                return <Stack.Screen 
                    name={session._id} 
                    key={session._id} 
                    options={{
                        headerTitle: session.name,
                        headerRight: () => (
                            <Button title="Actions" />
                        )
                    }}
                    children={(props) => <PhotosScreen {...props} session={session} user={user} />} 
                />
            })}
        </Stack.Navigator>
    );
}

export default SessionsNavigator;