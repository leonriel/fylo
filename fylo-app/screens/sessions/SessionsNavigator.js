import { useState, useEffect } from 'react';
import { HeaderStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { View, Pressable, Text, StyleSheet } from 'react-native';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import SessionsScreen from './SessionsScreen';
import PhotosScreen from './PhotosScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { CLOUDFRONT_DOMAIN } from '@env';

const SessionsNavigator = ({ navigation, sessions, user }) => {
    const Stack = createStackNavigator();

    const [galleries, setGalleries] = useState([]);

    // useEffect(() => {
    //     const loadImages = async (session) => {
    //         try {
    //             const prefetchedImages = session.photos.map((photo) => {
    //                 const url = `${CLOUDFRONT_DOMAIN}/public/${photo.key}`
    //                 return Image.prefetch(url)
    //             })
        
    //             await Promise.all(prefetchedImages);
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             return <Stack.Screen 
    //                 name={session._id} 
    //                 key={session._id} 
    //                 options={{
    //                     header: ({navigation}) => {
    //                         return <View style={styles.header}>
    //                             <Pressable onPress={() => navigation.goBack()}>
    //                                 <Ionicons name="chevron-back-outline" size={30} color="black" />
    //                             </Pressable>
    //                             <Text style={{fontFamily: "Quicksand-Bold", fontSize: 20}}>{session.name}</Text>
    //                             <Pressable>
    //                                 <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
    //                             </Pressable>
    //                         </View>
    //                     },
    //                     headerStyle: {
    //                         height: 30
    //                     },
    //                     // headerTitle: session.name,
    //                     // headerBackImage: () => (
    //                     //     <Ionicons name="chevron-back-outline" size={30} color="black" />
    //                     // ),
    //                     // headerShadowVisible: false,
    //                     // headerBackTitleVisible: false,
    //                     // headerRight: () => (
    //                     //     <MaterialCommunityIcons name="dots-vertical" size={30} color="black" />
    //                     // )
    //                 }}
    //                 children={(props) => <PhotosScreen {...props} session={session} user={user} />} 
    //             />
    //         }
    //     }

    //     const loadScreens = async (sessions) => {
    //         const screens = await Promise.all(sessions.map(session => loadImages(session)));
    //         setGalleries(screens);
    //     }

    //     loadScreens(sessions);
    // }, [sessions])

    return (
        <Stack.Navigator initialRouteName="Sessions">
            <Stack.Screen name="Sessions" children={(props) => <SessionsScreen {...props} sessions={sessions} user={user} />} options={{headerShown: false}}/>
            {/* {galleries} */}
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