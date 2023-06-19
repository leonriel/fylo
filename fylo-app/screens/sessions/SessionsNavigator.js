import { HeaderStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { View, Pressable, Text, StyleSheet } from 'react-native';
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
                        header: ({navigation}) => {
                            return <View style={styles.header}>
                                <Pressable onPress={() => navigation.goBack()}>
                                    <Ionicons name="chevron-back-outline" size={30} color="black" />
                                </Pressable>
                                <Text style={{fontFamily: "Quicksand-Bold", fontSize: 20}}>{session.name}</Text>
                                <Pressable>
                                    <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
                                </Pressable>
                            </View>
                        },
                        headerStyle: {
                            height: 30
                        },
                        // headerTitle: session.name,
                        // headerBackImage: () => (
                        //     <Ionicons name="chevron-back-outline" size={30} color="black" />
                        // ),
                        // headerShadowVisible: false,
                        // headerBackTitleVisible: false,
                        // headerRight: () => (
                        //     <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
                        // )
                    }}
                    children={(props) => <PhotosScreen {...props} session={session} user={user} />} 
                />
            })}
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    header: {
        width: "100%", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        alignSelf: "center",
        marginVertical: 10
    }
})
export default SessionsNavigator;