import { useState, useEffect, useContext, useRef } from 'react';
import { Text, StyleSheet, TextInput, Pressable, View, FlatList, Keyboard, ScrollView, RefreshControl } from 'react-native';
import { getUsers, sendFriendRequest, removeFriend, searchUsers, getPendingIncomingFriendRequests, getPendingOutgoingFriendRequests, acceptFriendRequest, ignoreFriendRequest, cancelFriendRequest } from '../utils/Users';
import { Entypo } from '@expo/vector-icons';
import UserListItem from '../components/UserListItem';
import Button from '../components/Button';
import { AuthContext } from '../contexts/AuthContext';

const FriendsScreen = ({navigation, user}) => {
    const { refreshUser } = useContext(AuthContext);

    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [results, setResults] = useState([]);
    const [focused, setFocused] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const searchBar = useRef('');

    useEffect(() => {
        const load = async () => {
            await loadIncomingRequests();
            await loadOutgoingRequests();
            await loadFriends();
        }

        load();
    }, []);

    const loadIncomingRequests = async () => {
        let requests = await getPendingIncomingFriendRequests(user._id);

        requests = requests.map(request => request.sender);

        setIncomingRequests(requests);
    }

    const loadOutgoingRequests = async () => {
        let requests = await getPendingOutgoingFriendRequests(user._id);
        
        requests = requests.map(request => request.recipient);

        setOutgoingRequests(requests);
    }

    const loadFriends = async () => {
        const friends = await getUsers(user.friends);

        setFriends(friends);
    }

    const handleSearch = async (text) => {
        if (text) {
            const searchResults = await searchUsers(text);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }

    const handleSendFriendRequest = async (friendId) => {
        try {
            await sendFriendRequest(user._id, friendId);
            loadOutgoingRequests();
        } catch (error) {
            console.log(error);
        }
    }

    const handleAcceptFriendRequest = async (senderId) => {
        try {
            await acceptFriendRequest(senderId, user._id)
            user.friends.push(senderId);
            await loadFriends();
            await loadIncomingRequests();            
            await refreshUser(user.username);
        } catch (error) {
            console.log(error);
        }
    }

    const handleRemoveFriend = async (friendId) => {
        try {
            await removeFriend(user._id, friendId);
            await refreshUser(user.username);
            await loadFriends();
        } catch (error) {
            console.log(error);
        }
    }

    const handleIgnoreRequest = async (senderId) => {
        try {
            await ignoreFriendRequest(senderId, user._id);
            await loadIncomingRequests();
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelRequest = async (recipientId) => {
        try {
            await cancelFriendRequest(user._id, recipientId)
            await loadOutgoingRequests();
        } catch (error) {
            console.log(error);
        }
    }

    const handleCancelSearch = async () => {
        Keyboard.dismiss();
        searchBar.current.clear();
        setResults([]);
        setFocused(false);
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(async () => {
            await refreshUser(user.username);
            await loadIncomingRequests();
            await loadOutgoingRequests();
            await loadFriends();
            setRefreshing(false);
        }, 1000);
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.searchComponent}>
                <View style={styles.searchBarContainer}>
                    <Entypo name="magnifying-glass" size={24} color="black" />
                    <TextInput 
                        autoCorrect={false}
                        clearButtonMode={'while-editing'}
                        ref={input => {searchBar.current = input}}
                        style={styles.searchBar} 
                        placeholder="Add or search friends"
                        placeholderTextColor='gray'
                        onChangeText={(text) => handleSearch(text)}
                        onFocus={() => setFocused(true)}
                    />
                </View>
                {focused && <View style={styles.cancelSearch}>
                    <Button 
                        borderRadius={20}
                        backgroundColor="#E8763A"
                        height={25}
                        aspectRatio="3/1"
                        fontFamily="Quicksand-SemiBold"
                        fontColor="white"
                        fontSize={15}
                        text="Cancel"
                        handler={handleCancelSearch}
                    />
                </View>}
            </View>
            <ScrollView 
                contentContainerStyle={{height: "100%"}}                         
                keyboardShouldPersistTaps='handled'
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} /> }
            >
                {outgoingRequests.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.header}>
                            <Text style={styles.title}>ADDED</Text>
                        </View>
                        <FlatList 
                            data={outgoingRequests}
                            renderItem={({item}) => {
                                return (
                                    <UserListItem 
                                        firstName={item.firstName} 
                                        lastName={item.lastName} 
                                        fullName={item.fullName} 
                                        username={item.username}
                                        button={
                                            <Pressable onPress={() => handleCancelRequest(item._id)} >
                                                <Entypo name="cross" size={16} color="gray" />
                                            </Pressable>
                                        }
                                    />
                                )
                            }} 
                            keyExtractor={item => item._id}
                            contentContainerStyle={{alignSelf: "center", width: "90%"}}
                            scrollEnabled={false}
                            keyboardShouldPersistTaps='handled'
                        />
                    </View>
                )}
                {incomingRequests.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.header}>
                            <Text style={styles.title}>ADDED ME</Text>
                        </View>
                        <FlatList 
                            data={incomingRequests}
                            renderItem={({item}) => {
                                return (
                                    <UserListItem 
                                        firstName={item.firstName} 
                                        lastName={item.lastName} 
                                        fullName={item.fullName} 
                                        username={item.username}
                                        button={
                                            <>
                                                <Button 
                                                    borderRadius={20}
                                                    backgroundColor="#E8763A"
                                                    height={25}
                                                    aspectRatio="3/1"
                                                    fontFamily="Quicksand-SemiBold"
                                                    fontColor="white"
                                                    fontSize={15}
                                                    text="+ Accept"
                                                    handler={() => handleAcceptFriendRequest(item._id)}
                                                />
                                                <Pressable onPress={() => handleIgnoreRequest(item._id)} >
                                                    <Entypo name="cross" size={16} color="gray" />
                                                </Pressable>
                                            </>
                                        }
                                    />
                                )
                            }} 
                            keyExtractor={item => item._id}
                            contentContainerStyle={styles.sectionContents}
                            scrollEnabled={false}
                            keyboardShouldPersistTaps='handled'
                        />
                    </View>
                )}
                <View style={styles.section}>
                    <View style={styles.header}>
                        <Text style={styles.title}>FRIENDS</Text>
                    </View>
                    {friends.length > 0 ? (
                        <FlatList 
                            data={friends}
                            renderItem={({item}) => {
                                return (
                                    <UserListItem 
                                        firstName={item.firstName} 
                                        lastName={item.lastName} 
                                        fullName={item.fullName} 
                                        username={item.username}
                                        button={
                                            <Pressable onPress={() => handleRemoveFriend(item._id)} >
                                                <Entypo name="cross" size={16} color="gray" />
                                            </Pressable>
                                        }
                                    />
                                )
                            }} 
                            keyExtractor={item => item._id}
                            contentContainerStyle={styles.sectionContents}
                            scrollEnabled={false}
                            keyboardShouldPersistTaps='handled'
                        />
                    ) : (
                        <View style={{alignSelf: "center", width: "90%", alignItems: "center"}}>
                            <Text style={{fontFamily: "Quicksand-Regular", fontSize: 20, textAlign: "center"}}>Add Fylo friends to make creating sessions easier!</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <View 
                style={styles.dropdown}
            >
                <FlatList 
                    data={results}
                    renderItem={({item}) => {
                        return <UserListItem 
                            firstName={item.firstName} 
                            lastName={item.lastName} 
                            fullName={item.fullName} 
                            username={item.username}
                            button={() => {
                                if (outgoingRequests.some(request => request.username == item.username)) {
                                    return <Button 
                                        borderRadius={20}
                                        backgroundColor="#E8763A"
                                        height={25}
                                        aspectRatio="3/1"
                                        fontFamily="Quicksand-SemiBold"
                                        fontColor="white"
                                        fontSize={15}
                                        text="Added!"
                                    />
                                } else if (incomingRequests.some(request => request.username == item.username)) {
                                    return <Button 
                                        borderRadius={20}
                                        backgroundColor="#E8763A"
                                        height={25}
                                        aspectRatio="3/1"
                                        fontFamily="Quicksand-SemiBold"
                                        fontColor="white"
                                        fontSize={15}
                                        text="+ Accept"
                                        handler={() => handleAcceptFriendRequest(item._id)}
                                    />
                                } else if (friends.some(friend => friend.username == item.username)) {
                                    return <Button 
                                        borderRadius={20}
                                        backgroundColor="#E8763A"
                                        height={25}
                                        aspectRatio="3/1"
                                        fontFamily="Quicksand-SemiBold"
                                        fontColor="white"
                                        fontSize={15}
                                        text="Friends!"
                                    />
                                } else {
                                    return <Button 
                                        borderRadius={20}
                                        backgroundColor="#E8763A"
                                        height={25}
                                        aspectRatio="3/1"
                                        fontFamily="Quicksand-SemiBold"
                                        fontColor="white"
                                        fontSize={15}
                                        text="+ Add"
                                        handler={() => handleSendFriendRequest(item._id)}
                                    />
                                }
                            }}
                        />
                    }}
                    keyExtractor={item => item._id}
                    keyboardShouldPersistTaps='handled'
                />
                {/* {results.length > 0 ? (
                    <FlatList 
                        data={results}
                        renderItem={({item}) => {
                            <UserListItem 
                                firstName={item.firstName} 
                                lastName={item.lastName} 
                                fullName={item.fullName} 
                                username={item.username}
                            />
                        }}
                        keyExtractor={item => item._id}
                    />
                ) : (
                    <Text style={{fontSize: 20, fontFamily: "Quicksand-Regular"}}>No matches</Text>
                )} */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: "center", 
        marginTop: 10
    },
    section: {
        width: "100%", 
        marginTop: 20
    },
    sectionContents: {
        width: "90%", 
        alignSelf: "center"
    },
    header: {
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        alignSelf: "center", 
        width: "90%"
    },
    title: {
        fontFamily: "Quicksand-SemiBold", 
        fontSize: 12
    },
    searchBarContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems:"center",
        alignSelf: "center",
        flex: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 40,
        overflow: "hidden",
    },
    searchComponent: {
        width: "90%",
        alignSelf: "center",
        flexDirection: "row"
    },
    searchBar: {
        width: "90%", 
        height: "100%", 
        fontSize: 20, 
        fontFamily: "Quicksand-Regular", 
        paddingHorizontal: 5
    },
    cancelSearch: {
        alignSelf: "center",
        marginLeft: 10
    },
    dropdown: {
        backgroundColor: "white", 
        width: "90%", 
        alignSelf: "center", 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderRadius: 10,
        position: 'absolute', 
        top: "8%",
        paddingHorizontal: 10
    }
});

export default FriendsScreen;