import { useState, useContext } from 'react';
import { Pressable, View, StyleSheet, FlatList, Text, Modal, RefreshControl } from 'react-native';
// import { Image } from 'expo-image';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import SessionListItem from  '../../components/SessionListItem';
import NameSessionScreen from '../create_session/NameSessionScreen';
import { AntDesign, Ionicons } from '@expo/vector-icons'; 
import { SessionsContext } from '../../contexts/SessionsContext';

const SessionsScreen = ({ navigation, sessions, user }) => {
    const { reloadSessions } = useContext(SessionsContext);

    const [createSessionModalVisible, setCreateSessionModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await reloadSessions(user.sessions);
            setRefreshing(false);
        }, 1000);
    }

    return (
        <View style={{flex: 1, alignItems: "center", marginTop: 10}}>
            <View style={styles.header}>
                <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 30}}>Sessions</Text>
                <Pressable onPress={() => setCreateSessionModalVisible(true)} style={({pressed}) => [pressed && {opacity: 0.5}, {marginLeft: 5}]}>
                    <AntDesign name="plus" size={24} color="black" />
                </Pressable>
            </View>
            <View style={styles.sessionsContainer}>
                <FlatList
                    data={sessions}
                    renderItem={({item}) => {
                        const date = new Date(item.createdAt);
                        const stringDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric'});

                        return (<Pressable 
                            onPress={() => navigation.navigate(item._id)} 
                            style={{
                                width: "90%", 
                                alignSelf: "center", 
                                backgroundColor: "white", 
                                shadowOffset: { width: 0, height: 2}, 
                                shadowOpacity: 0.25,
                                shadowRadius: 5, 
                                borderRadius: 10
                            }}
                        >
                            <View style={{width: "95%", flexDirection: "row", alignSelf: "center"}}>
                                <SessionListItem 
                                    sessionName={item.name} 
                                    numContributors={item.contributors.length}
                                    button1={
                                        <View style={{flexDirection: 'row', alignItems: "center"}}>
                                            <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 20}}>{stringDate}</Text>
                                            <View style={{height: 20, width: 1, backgroundColor: 'black', opacity: 1, marginHorizontal: 5}} />
                                            <Text style={{fontFamily: "Quicksand-SemiBold", fontSize: 20}}>{item.photos.length}</Text>
                                        </View>
                                    }
                                />
                            </View>
                        </Pressable>
                    )}}
                    keyExtractor={(item) => item._id}
                    ItemSeparatorComponent={() => <View style={{height: 10, backgroundColor: "transparent"}} />}
                    contentContainerStyle={{paddingVertical: 10, height: "100%"}}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                />
            </View>
            <Modal
                animationType="slide"
                visible={createSessionModalVisible}
                onRequestClose={() => setCreateSessionModalVisible(false)}
            >
                <SafeAreaProvider>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Pressable onPress={() => setCreateSessionModalVisible(false)} style={({ pressed }) => pressed && {opacity: 0.5}}>
                                <Ionicons name="chevron-down" size={30} color="black" />
                            </Pressable>
                        </View>
                        <NameSessionScreen navigation={navigation} user={user} sessions={sessions} handleClose={() => setCreateSessionModalVisible(false)} />
                    </SafeAreaView>
                </SafeAreaProvider>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        alignSelf: "center", 
        width: "90%"
    },
    logo: {
        height: 25, 
        aspectRatio: "228/76" 
    },
    sessionsContainer: {
        width: "100%"
    }
});

export default SessionsScreen;