import { useState, useEffect } from 'react';
import { HeaderStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { View, Pressable, Text, StyleSheet, Button } from 'react-native';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import SessionsScreen from './SessionsScreen';
import PhotosScreen from './PhotosScreen';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { CLOUDFRONT_DOMAIN } from '@env';

const SessionsNavigator = ({ navigation, sessions, user, handleOpenCamera }) => {
    const Stack = createStackNavigator();

    useEffect(() => {
        sessions.forEach(session => {
            FastImage.preload(session.photos.map(photo => {
                return {uri: `${CLOUDFRONT_DOMAIN}/public/${photo.key}`}
            }))
        })
    })

    return (
        <Stack.Navigator initialRouteName="Sessions">
            <Stack.Screen 
                name="Sessions" 
                children={(props) => <SessionsScreen {...props} sessions={sessions} user={user} handleOpenCamera={handleOpenCamera} />} 
                options={{headerShown: false}}
            />
            {/* {galleries} */}
            {sessions.map(session => {
                return <Stack.Screen 
                    name={session._id} 
                    key={session._id} 
                    options={{
                        header: ({navigation}) => {
                            return <View style={styles.header}>
                                <Pressable onPress={() => navigation.goBack()} style={({pressed}) => [pressed && {opacity: 0.5}, {flex: 1}]}>
                                    <Ionicons name="chevron-back-outline" size={30} color="black" />
                                </Pressable>
                                <Pressable style={{flex: 6, flexDirection: "row", justifyContent: "flex-start"}}>
                                    <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 24}}>{session.name}</Text>
                                </Pressable>
                                <View style={{flexDirection: "row", alignItems: "center", flex: 2, justifyContent: "flex-end"}}>
                                    {session.isActive && (
                                        <>
                                            <Pressable style={({pressed}) => [pressed && {opacity: 0.5}]}>
                                                <AntDesign name="adduser" size={24} color="black" />
                                            </Pressable>
                                            <Pressable style={({pressed}) => [pressed && {opacity: 0.5}, {marginLeft: 5}]}>
                                                <AntDesign name="plus" size={24} color="black" />
                                            </Pressable>
                                            {session.owner == user._id && <Button title="End" />}
                                        </>
                                    )}
                                </View>
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
        width: "95%", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        alignSelf: "center",
        marginVertical: 10
    }
})
export default SessionsNavigator;