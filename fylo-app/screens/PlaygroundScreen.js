import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput,
  ImageBackground,
  View,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import {
  Entypo,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Feather,
  FontAwesome5,
} from "@expo/vector-icons";

const PlaygroundScreen = ({ user, sessions }) => {
  const [playgroundSessions, setPlaygroundSessions] = useState(sessions);
  const [searchText, setSearchText] = useState("");

  function searchInputHandler(enteredText) {
    setSearchText(enteredText.toLowerCase());
  }

  function clearSearch() {
    setSearchText("");
  }

  function convertDate(dbDate) {
    const date = new Date(dbDate);
    return date;
  }

  function formatDate(convertedDate) {
    return convertedDate.toString().substring(4, 10);
  }

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Entypo name="home" size={35} color="white" />
          </Pressable>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../assets/icon.png")}
          />
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Ionicons name="camera-outline" size={35} color="white" />
          </Pressable>
        </View>
        <View style={styles.subHeaderContainer}>
          <Text style={styles.headerText}>Albums</Text>
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <MaterialIcons name="sort" size={40} color="white" />
          </Pressable>
        </View>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            style={styles.searchIcon}
            size={26}
            color="#58b7b5"
          />
          <TextInput
            style={styles.searchBar}
            placeholder=" Search"
            onChangeText={searchInputHandler}
            value={searchText}
          />
          {searchText.length !== 0 && (
            <Pressable
              style={({ pressed }) => pressed && styles.pressedItem}
              onPress={clearSearch}
            >
              <Ionicons name="close" size={24} color="rgba(0, 0, 0, 0.2)" />
            </Pressable>
          )}
        </View>
        <View>
          {playgroundSessions.length === 0 ? (
            <View style={styles.sessionsContainer}>
              <Text style={styles.noSessionsText}>
                Create a session to get started!
              </Text>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.sessionsContainer}
              alwaysBounceVertical={true}
            >
              {playgroundSessions
                .sort((a, b) => {
                  return (
                    b.isActive - a.isActive ||
                    convertDate(b.updatedAt).getTime() -
                      convertDate(a.updatedAt).getTime()
                  );
                })
                .filter(
                  (session) =>
                    session.name.toLowerCase().indexOf(searchText) > -1
                )
                .map((session) => (
                  <View key={session._id} style={styles.sessionCard}>
                    <Pressable
                      style={({ pressed }) => pressed && styles.pressedItem}
                    >
                      <ImageBackground
                        imageStyle={styles.sessionImage}
                        style={[
                          styles.sessionImageCard,
                          session.isActive && {
                            justifyContent: "space-between",
                          },
                        ]}
                        source={require("../assets/icon.png")}
                      >
                        {session.isActive && (
                          <View style={styles.sessionActivityContainer}>
                            <Feather
                              name="radio"
                              style={styles.sessionActiveIcon}
                              size={25}
                              color="white"
                            />
                            <Text style={styles.sessionActivityText}>
                              Currently Active
                            </Text>
                            <Pressable
                              style={({ pressed }) =>
                                pressed
                                  ? [
                                      styles.pressedItem,
                                      styles.exitActiveSessionIcon,
                                    ]
                                  : styles.exitActiveSessionIcon
                              }
                            >
                              <Ionicons
                                name="exit-outline"
                                style={styles.exitActiveSessionIcon}
                                size={23}
                                color="white"
                              />
                            </Pressable>
                          </View>
                        )}
                        <View style={styles.sessionInfoContainer}>
                          <Text style={styles.sessionNameText}>
                            {session.name}
                          </Text>
                          <View style={styles.numContributorsContainer}>
                            <Text style={styles.numContributorsText}>
                              {session.contributors.length}
                            </Text>
                            <FontAwesome5
                              name="user-friends"
                              style={styles.numContributorsIcon}
                              size={14}
                              color="white"
                            />
                          </View>
                          <Text style={styles.sessionInfoText}>
                            {formatDate(convertDate(session.updatedAt))} | #
                          </Text>
                        </View>
                      </ImageBackground>
                    </Pressable>
                  </View>
                ))}
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default PlaygroundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#58b7b5",
  },
  pressedItem: {
    opacity: 0.5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "13%",
    marginHorizontal: "3.5%",
    height: "5%",
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "3.5%",
    marginBottom: "1%",
    height: "5%",
  },
  headerText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 23,
    color: "white",
  },
  logo: {
    width: "50%",
    height: "70%",
    marginTop: "1%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "5%",
    backgroundColor: "white",
    width: "95%",
    marginLeft: "2.5%",
    borderRadius: "20%",
  },
  searchIcon: {
    marginLeft: "2%",
  },
  searchBar: {
    height: "80%",
    width: "80%",
    marginLeft: "1.5%",
    textAlign: "left",
  },
  noSessionsText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 20,
    color: "white",
    marginTop: "5%",
  },
  sessionsContainer: {
    margin: "3.5%",
    height: "80%",
    alignItems: "center",
  },

  sessionCard: {
    height: "20%",
    width: "100%",
    marginVertical: "2.5%",
    borderRadius: "12.5%",
  },
  sessionImageCard: {
    height: "100%",
    borderRadius: "12.5%",
    justifyContent: "flex-end",
  },
  sessionImage: {
    resizeMode: "cover",
    borderRadius: 12.5,
  },
  sessionActivityContainer: {
    backgroundColor: "rgba(121, 160, 212, 0.5)",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    borderTopLeftRadius: "12.5%",
    borderTopRightRadius: "12.5%",
  },
  sessionActivityText: {
    fontFamily: "Quicksand-Regular",
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginLeft: "2%",
  },
  sessionActiveIcon: {
    marginLeft: "4%",
  },
  exitActiveSessionIcon: {
    marginRight: "1.5%",
  },
  sessionInfoContainer: {
    backgroundColor: "rgba(121, 160, 212, 0.5)",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    color: "white",
    borderBottomLeftRadius: "12.5%",
    borderBottomRightRadius: "12.5%",
  },
  sessionNameText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    marginLeft: "4%",
  },
  sessionInfoText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    marginRight: "3.5%",
  },
  numContributorsContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "2.5%",
    marginTop: "0.5%",
  },
  numContributorsText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },
  numContributorsIcon: {
    marginLeft: "1%",
  },
});
