import { useState, useEffect, useContext } from 'react';
import { Text, StyleSheet, SafeAreaView, TextInput, Alert, View, Button, Keyboard } from 'react-native';
import { getUsers, sendFriendRequest, removeFriend, searchUsers } from '../utils/Users';
import { AuthContext } from '../contexts/AuthContext';

const FriendsScreen = ({navigation, user}) => {
    const [searchedFriends, setSearchedFriends] = useState([]);
    const [searchedStrangers, setSearchedStrangers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [friends, setFriends] = useState([]);
    const [searchActive, setSearchActive] = useState(false);

    const { refreshUser } = useContext(AuthContext);

    useEffect(() => {
        const loadFriends = async () => {
            const users = await getUsers(user.friends);
            setFriends(users);
        }

        loadFriends();
    }, [user]);

    const handleUserSearch = async (query) => {
        const searchedUsers = await searchUsers(query);

        const resultsFriends = [];

        const resultsStrangers = [];

        searchedUsers.forEach(searchedUser => {
            const searchedUsername = searchedUser.username;
            const searchedFullName = searchedUser.fullName;
            if (searchedUsername != user.username) {
                if (user.friends.includes(searchedUsername)) {
                    const component = (
                        <View key={searchedUsername} style={styles.friend}>
                            <Text style={styles.text}>{searchedFullName}</Text>
                        </View>
                    )
                    resultsFriends.push(component);
                } else {
                    const component = (
                        <View key={searchedUsername} style={styles.friend}>
                            <Text style={styles.text}>{searchedFullName}</Text>
                            <Button onPress={() => handleAddFriend(searchedUser)} title="Add" />
                        </View>
                    )
                    resultsStrangers.push(component);
                }
            }
        })

        setSearchedFriends(resultsFriends);
        setSearchedStrangers(resultsStrangers);
    }

    const handleAddFriend = async (friend) => {
        sendFriendRequest(user, friend).then((resp) => {
            Alert.alert("Friend added!");
            refreshUser(user.username);
        });
    }

    const handleActiveSearch = async () => {
        setSearchActive(true);
    }

    const handleCancelSearch = async () => {
        setSearchActive(false);
        Keyboard.dismiss();
        setSearchedFriends([]);
        setSearchedStrangers([]);
        setSearchText('');
    }
    
    const handleRemoveFriend = async (friend) => {
        return Alert.alert('Are you sure?', '', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {  
                text: 'Remove',
                onPress: async () => {
                    await removeFriend(user.friend);
                    refreshUser(user.username);
                }
            }
        ])
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput style={styles.input} placeholder="Add or search friends" value={searchText} onPressIn={handleActiveSearch} onChangeText={(text) => {
                    setSearchText(text);
                    if (text != '') {
                        handleUserSearch(text)
                    } else {
                        setSearchedFriends([]);
                        setSearchedStrangers([]);
                    }
                }} />
                {searchActive && <Button style={{flex: 1}} title="Cancel" onPress={handleCancelSearch} />}
            </View>
            {searchText == '' ? (
                <>
                    <Text style={styles.text}>My Friends</Text>
                    <View style={styles.friendsContainer}>
                    {friends.map(friend => (
                        <View key={friend.username} style={styles.friend}>
                            <Text style={styles.text}>{friend.fullName}</Text>
                            <Button title="Remove" onPress={() => handleRemoveFriend(friend.username)} />
                        </View>
                    ))}
                    </View>
                </> ) : (
                    <>
                        {searchedFriends.length != 0 ? (
                            <>
                                <Text style={styles.text}>My Friends</Text>
                                <View style={styles.friendsContainer}>
                                    {searchedFriends}
                                </View>
                            </>) : null}
                        {searchedStrangers.length != 0 ? (
                            <>
                                <Text style={styles.text}>Add Friends</Text>
                                <View style={styles.friendsContainer}>
                                    {searchedStrangers}
                                </View>
                            </>
                        ) : null}
                    </>
                )
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        margin: 8
    },
    friendsContainer: {
        flexDirection: 'column',
        width: "100%"
    },
    friend: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 8,
        margin: 8,
        justifyContent: "space-between",
        alignItems: 'center'
    },
    searchContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        margin: 8,
        padding: 8,
        fontSize: 16,
        flex: 5
    },
    text: {
        fontSize: 16,
        marginLeft: 8
    }
});

export default FriendsScreen;