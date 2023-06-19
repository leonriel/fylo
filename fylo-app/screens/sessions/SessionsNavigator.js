import { createStackNavigator } from "@react-navigation/stack";
import { Button } from 'react-native';
import SessionsScreen from './SessionsScreen';
import PhotosScreen from './PhotosScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const SessionsNavigator = ({ navigation, sessions, user }) => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Sessions">
            <Stack.Screen name="Sessions" children={(props) => <SessionsScreen {...props} sessions={sessions} user={user} />} options={{headerShown: false}}/>
            {sessions.map(session => {
                return <Stack.Screen 
                    name={session._id} 
                    key={session._id} 
                    options={{
                        headerTitle: session.name,
                        headerBackImage: () => (
                            <Ionicons name="chevron-back-outline" size={30} color="black" />
                        ),
                        headerShadowVisible: false,
                        headerBackTitleVisible: false,
                        headerRight: () => (
                            <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
                        )
                    }}
                    children={(props) => <PhotosScreen {...props} session={session} user={user} />} 
                />
            })}
        </Stack.Navigator>
    );
}

export default SessionsNavigator;