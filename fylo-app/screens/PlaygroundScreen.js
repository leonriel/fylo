import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  FlatList,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import axios from "axios";

const PlaygroundScreen = ({ user, sessions }) => {
  const [searchText, setSearchText] = useState("");
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [newSessionName, setNewSessionName] = useState(
    "My Session #" + (user.sessions.length + 1)
  );

  useEffect(() => {
    const grabUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
        setMatchingUsers(allUsers);
      } catch (error) {
        console.warn(error);
      }
    };

    grabUsers();
  }, []);

  const fetchAllUsers = async () => {
    const resp = await axios.post(
      "https://fylo-app-server.herokuapp.com/user/list"
    );
    return resp.data;
  };

  const searchForUsers = async (searchQuery) => {
    const resp = await axios.post(
      "https://fylo-app-server.herokuapp.com/user/search",
      { query: searchQuery }
    );
    return resp.data;
  };

  const sessionNameHandler = (enteredText) => {
    setNewSessionName(enteredText);
  };

  const searchInputHandler = (enteredText) => {
    setSearchText(enteredText);

    const grabUsers = async () => {
      try {
        const allUsers = await fetchAllUsers();
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

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <AntDesign
              name="arrowleft"
              style={styles.backArrow}
              size={28}
              color="white"
            />
          </Pressable>
          <Text style={styles.headerText}>New Session</Text>
          <TextInput
            style={styles.sessionNameInput}
            placeholder={"Enter session name"}
            onChangeText={sessionNameHandler}
            value={newSessionName}
          />
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <FontAwesome
                name="search"
                style={styles.searchIcon}
                size={20}
                color={"#e37356"}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Add by username, number, or scan"
                onChangeText={searchInputHandler}
                value={searchText}
              />
              {searchText.length !== 0 && (
                <Pressable
                  style={({ pressed }) => pressed && styles.pressedItem}
                  onPress={clearSearch}
                >
                  <Ionicons name="close" size={20} color="rgba(0,0,0,0.2)" />
                </Pressable>
              )}
            </View>
            <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                style={styles.qrIcon}
                size={24}
                color="white"
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.userListContainer}>
          <Text style={styles.userListHeader}>Add People to Album</Text>
          <View style={styles.userListHeaderDivider} />
          <Text style={styles.userListSubheader}>Users</Text>
          {matchingUsers.length === 0 ? (
            <Text style={styles.noUsersText}>No users found</Text>
          ) : (
            <FlatList
              data={matchingUsers}
              style={styles.userList}
              renderItem={(itemData) => {
                return (
                  <View style={styles.userCard}>
                    <Image
                      style={styles.userCardProfilePicture}
                      source={require("../assets/Default_pfp.png")}
                    ></Image>
                    <Text style={styles.userCardUsername}>
                      {itemData.item.fullName}
                    </Text>
                    <View style={styles.userCardAddButton}>
                      <Pressable
                        style={({ pressed }) => pressed && styles.pressedItem}
                      >
                        <Ionicons
                          name="add-circle-outline"
                          size={24}
                          color="black"
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default PlaygroundScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "white",
  },
  pressedItem: {
    opacity: 0.5,
  },
  headerContainer: {
    height: "30%",
    width: "100%",
    backgroundColor: "#e37356",
    justifyContent: "flex-end",
  },
  backArrow: {
    marginHorizontal: "6%",
    marginBottom: "0.5%",
  },
  headerText: {
    color: "white",
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    marginHorizontal: "6%",
    marginBottom: "6%",
  },
  sessionNameInput: {
    fontFamily: "Quicksand-Bold",
    fontSize: 30,
    color: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    width: "84%",
    height: "16%",
    marginHorizontal: "6%",
    marginBottom: "3%",
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
