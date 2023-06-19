import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';

const PlaygroundScreen = ({ user, sessions }) => {
    // const [searchText, setSearchText] = useState('');
    const [matchedUsers, setMatchedUsers] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.post("https://fylo-app-server.herokuapp.com/user/search", { query: "fylo" });
    //             setMatchedUsers(response.data);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     };
    //     fetchData();
    // }, []);

    const handleUserSearch = async (text) => {
        try {
            const resp = await axios.post("https://fylo-app-server.herokuapp.com/user/search", { query: text});
            setMatchedUsers(resp.data);
        } catch (error) {
            setMatchedUsers([]);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to Fylo: Photo-sharing made easy</Text>
            <Text style={styles.searchTitle}>Add Friends</Text>
            {/* displays search bar */}
            <View style={{...styles.searchBar}}>
                <TextInput
                    placeholder="Search Username or Contact"
                    placeholderTextColor="gray"
                    onChangeText={(text) => handleUserSearch(text)}
                    style={{fontFamily: "Quicksand-Regular"}}
                />
            </View>
            <Text style={styles.friendsTitle}>Friends Nearby</Text>
            {/* need to add line */}
            {/* displays users that match search query */}
            <FlatList 
                data={matchedUsers}
                renderItem={({item}) => (
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginBottom: 10 }}>
                        <View style={{flexDirection: 'row'}}>
                            <View style={styles.profileIcon}>
                                <Text style={styles.initials}>{item.firstName.charAt(0)}{item.lastName.charAt(0)}</Text>
                            </View>
                            <View>
                                <Text style={styles.displayFullName}>{item.fullName}</Text>
                                <Text style={styles.username}>{item.username}</Text>
                            </View>
                        </View>
                        <View style={[styles.button, {
                            // width: 60,
                            // height: 35, left: 250
                        }]}>
                            <Text style={styles.buttonDesign}>Add</Text>
                        </View>
                    </View>
                )}
                keyExtractor={(user) => user._id} 
            />
            {/* {matchedUsers.map((user) => (
                <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={{flexDirection: 'row'}}>
                        <View style={styles.profileIcon}>
                            <Text style={styles.initials}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.displayFullName}>{user.fullName}</Text>
                            <Text style={styles.username}>{user.username}</Text>
                        </View>
                    </View>
                    <View style={[styles.button, {
                        // width: 60,
                        // height: 35, left: 250
                    }]}>
                        <Text style={styles.buttonDesign}>Add</Text>
                    </View>
                </View>
            ))} */}
            {/* example display of matched results */}
            {/* <View style={{ flexDirection: 'row', width: "90%", justifyContent: "space-between" }}>
                <View style={{flexDirection: 'row'}}>
                    <Text>PIC</Text>
                    <View>
                        <Text style={styles.displayFullName}>user.fullName</Text>
                        <Text style={styles.username}>user.username</Text>
                    </View>
                </View>
                <View style={[styles.button, {
                    // width: 60,
                    // height: 35, left: 250
                }]}>
                    <Text style={styles.buttonDesign}>Add</Text>
                </View>
            </View> */}

            {/* continues button */}
            <View style={{ alignItems: 'center' }}>
                <View style={[styles.button, {
                    width: 80,
                    height: 40, 
                    // bottom: -350
                }]}>
                    <Text style={styles.buttonDesign}>Continue</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    space: {
        width: 100,
    },
    displayFullName: {
        // left: 50,
        // position: 'absolute'
        fontFamily: "Quicksand-Regular",
        fontSize: 16,
        fontColor: "black"
    },
    username: {
        fontFamily: "Quicksand-Regular",
        fontSize: 12,
        fontColor: "gray"
    },
    add: {
        color: 'white',
        padding: 10,
        backgroundColor: '#E8763A',
        textAlign: 'center',

    },
    button: {
        // position: 'absolute',
        backgroundColor: '#E8763A',
        borderRadius: 10,
        padding: 10,
    },
    buttonDesign: {
        textAlign: 'center',
        color: 'white',
    },
    container: {
        // top: -100,
        flex: 1,
        backgroundColor: '#fff',
        width: "90%",
        alignSelf: "center"
        // justifyContent: 'center',

    },
    welcomeText: {
        // top: -150,
        fontFamily: "Quicksand-Regular",
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 40,
        color: '#797E79',
        alignSelf: "center"
    },
    searchTitle: {
        // top:-100,
        fontFamily: "Quicksand-Regular",
        fontSize: 22,
        // marginLeft: 10,
        marginBottom: 5,
    },
    friendsTitle: {
        fontSize: 22,
        fontFamily: "Quicksand-Regular"
    },
    searchBar: {
        padding: 10,
        width: 300,
        height: 40,
        backgroundColor: '#EAEAEA',
        borderColor: '#EAEAEA',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    profileIcon: {
        borderRadius: "50%", 
        height: 30, 
        width: 30, 
        backgroundColor: "#E8763A", 
        justifyContent: "center", 
        alignItems: "center",
        marginRight: 10
    },
    initials: {
        fontFamily: "Quicksand-Regular", 
        fontSize: 16, 
        color: "white"
    }
});

export default PlaygroundScreen;
