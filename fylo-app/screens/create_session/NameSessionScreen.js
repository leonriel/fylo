import { StyleSheet, Text, TextInput, Pressable, View, FlatList, Image, Alert } from "react-native";
import { useState, useEffect } from "react";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Input from '../../components/Input';
import { getAllUsers, searchUsers } from '../../utils/Users';
import { createSession } from "../../utils/Sessions";
import Button from '../../components/Button';
  
const NameSessionScreen = ({ navigation, user, sessions }) => {
    const [searchText, setSearchText] = useState("");
    const [matchingUsers, setMatchingUsers] = useState([]);
    const [sessionName, setSessionName] = useState("");

    useEffect(() => {
        const grabUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setMatchingUsers(allUsers);
        } catch (error) {
            console.warn(error);
        }
        };

        grabUsers();
    }, []);

    const searchForUsers = async (searchQuery) => {
        const resp = await axios.post(
        "https://fylo-app-server.herokuapp.com/user/search",
        { query: searchQuery }
        );
        return resp.data;
    };

    const sessionNameHandler = (enteredText) => {
        setSessionName(enteredText);
    };

    const searchInputHandler = (enteredText) => {
        setSearchText(enteredText);

        const grabUsers = async () => {
        try {
            const allUsers = await getAllUsers();
            setMatchingUsers(allUsers);
        } catch (error) {
            console.warn(error);
        }
        };

        const searchUsers = async () => {
        try {
            const searchedUsers = await searchForUsers(enteredText);
            setMatchingUsers(searchedUsers);
        } catch (error) {
            console.warn(error);
        }
        };

        enteredText.length === 0 ? grabUsers() : searchUsers();
    };

    const clearSearch = () => {
        setSearchText("");
    };

    const handleSessionCreation = async () => {
        try {
            if (sessionName == "") {
                throw new Error("Sessions need names!")
            }
            const newSession = await createSession(user._id, sessionName);
            user.sessions.push(newSession._id);
            navigation.navigate('Sessions Navigator', {screen: 'Sessions'})
            setCreateSessionModalVisible(false);
            refreshUser(user.username);
            reloadSessions(user.sessions);
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    return (
        <View style={{width: "100%", height: "50%", alignItems: "center", alignSelf: "center"}}>
            <Text style={styles.title}>Name Your Session</Text>
            <Input label="" width="80%" fontSize={16} placeholder={"My Session #" + (user.sessions.length + 1)} value={sessionName} handler={(text) => setSessionName(text)} secureTextEntry={false} />
            <Button     
                borderRadius={20}
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Create"
                margin={24}
                handler={handleSessionCreation}
            />
            {/* <Pressable onPress={() => console.log('hello')}>
                <View style={{height: 50, width: 50, backgroundColor: "red"}} /> 
            </Pressable>
            <Button title="hello" onPress={() => console.log('hello')} /> */}
        </View>
    );
};

export default NameSessionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    pressedItem: {
        opacity: 0.5,
    },
    headerContainer: {
        width: "95%",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    title: {
        fontFamily: "Quicksand-Regular",
        fontSize: 24,
        marginBottom: 32,
        marginTop: 32
    },
    searchContainer: {
        height: "13.5%",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "6%",
        marginBottom: "5%",
    },
    searchBar: {
        backgroundColor: "white",
        height: "100%",
        width: "80%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        borderRadius: "20%",
    },
    searchIcon: {
        marginLeft: "3%",
    },
    searchInput: {
        width: "80%",
        textAlign: "left",
        marginLeft: "2%",
    },
    qrIcon: {
        marginLeft: "12.5%",
    },
    userListContainer: {
        height: "70%",
    },
    userListHeader: {
        color: "black",
        fontFamily: "Quicksand-Bold",
        fontSize: 24,
        width: "84%",
        height: "5%",
        marginHorizontal: "6%",
        marginTop: "4%",
        marginBottom: "2.5%",
    },
    userListHeaderDivider: {
        borderBottomWidth: 2,
        borderBottomColor: "rgba(0, 0, 0, 0.2)",
        width: "84%",
        marginHorizontal: "6%",
        borderRadius: "15%",
    },
    userListSubheader: {
        color: "black",
        fontFamily: "Quicksand-Bold",
        fontSize: 20,
        width: "84%",
        height: "4%",
        marginTop: "2%",
        marginHorizontal: "6%",
    },
    userList: {
        marginTop: "1%",
        marginHorizontal: "6%",
    },
    userCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "2%",
    },
    userCardProfilePicture: {
        resizeMode: "contain",
        width: "10%",
        height: "150%",
    },
    userCardUsername: {
        fontFamily: "Quicksand-Regular",
        fontSize: 16,
        flex: 1,
        marginLeft: "3%",
    },
    userCardAddButton: {
        width: "10%",
    },
    noUsersText: {
        fontFamily: "Quicksand-Regular",
        fontSize: 18,
        color: "#aaaaaa",
        width: "100%",
        textAlign: "center",
        marginTop: "3%",
    },
});
  