import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Text, FlatList } from 'react-native';
import axios from 'axios';

const PlaygroundScreen = ({ user, sessions }) => {
    const [searchText, setSearchText] = useState('');
    const [matchedUsers, setMatchedUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("https://fylo-app-server.herokuapp.com/user/search", { username: "fylo" });
                setMatchedUsers(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to Fylo: Photo-sharing made easy</Text>
            <Text style={styles.searchTitle}>Add Friends</Text>
            {/* displays search bar */}
            <View style={styles.searchBar}>
                <TextInput
                    placeholder="Search Username or Contact"
                    placeholderTextColor="gray"
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>
            <Text style={styles.friendsTitle}>Friends Nearby</Text>
            {/* need to add line */}
            {/* displays users that match search query */}
            {matchedUsers.map((user) => (
                <View style={{ flexDirection: 'row' }}>
                <Text>PIC</Text>
                <Text style={styles.displayFullName}>{user.fullName}</Text>
                <View style={[styles.button, {
                    width: 60,
                    height: 35, left: 250
                }]}>
                    <Text style={styles.buttonDesign}>Add</Text>
                </View>
            </View>
            ))}
            {/* example display of matched results */}
            <View style={{ flexDirection: 'row'}}>
                <Text>PIC</Text>
                <Text style={styles.displayFullName}>user.fullName</Text>
                <View style={[styles.button, {
                    width: 60,
                    height: 35, left: 250
                }]}>
                    <Text style={styles.buttonDesign}>Add</Text>
                </View>
            </View>

            {/* continues button */}
            <View style={{ alignItems: 'center' }}>
                <View style={[styles.button, {
                    width: 80,
                    height: 40, bottom: -350
                }]}>
                    <Text style={styles.buttonDesign}>Continue</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    space: {
        width: 100,
    },
    displayFullName: {
        left: 50,
        position: 'absolute'
    },
    add: {
        color: 'white',
        padding: 10,
        backgroundColor: '#E8763A',
        textAlign: 'center',

    },
    button: {
        position: 'absolute',
        backgroundColor: '#E8763A',
        borderRadius: 10,
        padding: 10,
    },
    buttonDesign: {
        textAlign: 'center',
        color: 'white',
    },
    container: {
        top: -100,
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',

    },
    welcomeText: {
        // top: -150,
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 40,
        color: '#797E79',
    },
    searchTitle: {
        // top:-100,
        fontSize: 22,
        marginLeft: 10,
        marginBottom: 5,
    },
    friendsTitle: {
        fontSize: 22,
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
});

export default PlaygroundScreen;
