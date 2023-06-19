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
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            onChangeText={searchInputHandler}
          />
          <FontAwesome
            name="search"
            style={styles.searchIcon}
            size={26}
            color="#58b7b5"
          />
        </View>
        <View>
          <ScrollView
            contentContainerStyle={styles.sessionsContainer}
            alwaysBounceVertical={true}
          >
            {playgroundSessions
              .sort((a, b) => {
                return b.isActive - a.isActive || b.getTime() - a.getTime();
              })
              .filter(
                (session) => session.name.toLowerCase().indexOf(searchText) > -1
              )
              .map((session) => (
                <View key={session._id} style={styles.sessionCard}>
                  <Pressable
                    style={({ pressed }) => pressed && styles.pressedItem}
                  >
                    <ImageBackground
                      imageStyle={styles.sessionImage}
                      style={styles.sessionCard}
                      source={require("../assets/icon.png")}
                    >
                      <View
                        style={[
                          styles.sessionActivityContainer,
                          !session.isActive && styles.invisible,
                        ]}
                      >
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
  invisible: {
    opacity: 0,
  },
  pressedItem: {
    opacity: 0.5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15%",
    marginHorizontal: "3.5%",
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "3.5%",
    marginBottom: "1%",
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
    marginHorizontal: 16,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "5%",
  },
  searchIcon: {
    marginLeft: "-91.5%",
  },
  searchBar: {
    backgroundColor: "white",
    height: "100%",
    width: "95%",
    marginLeft: "2.5%",
    borderRadius: 30,
    textAlign: "center",
  },
  sessionsContainer: {
    margin: 16,
    height: "80%",
  },
  sessionCard: {
    height: "20%",
    marginVertical: "2.5%",
    borderRadius: 15,
  },
  sessionImage: {
    resizeMode: "cover",
    borderRadius: 15,
    marginVertical: "-2.5%",
    height: "1350%",
  },
  sessionActivityContainer: {
    marginVertical: "-2.5%",
    backgroundColor: "rgba(121, 160, 212, 0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: "405%",
  },
  sessionActivityText: {
    fontFamily: "Quicksand-Regular",
    fontWeight: "bold",
    color: "white",
    flex: 5,
    margin: "2%",
  },
  sessionActiveIcon: {
    flex: 1,
    height: "100%",
    marginRight: "-8.5%",
    marginLeft: "4%",
    marginTop: "1%",
  },
  exitActiveSessionIcon: {
    marginTop: "1%",
    marginRight: "1.5%",
  },
  sessionInfoContainer: {
    marginVertical: "14.2%",
    backgroundColor: "rgba(121, 160, 212, 0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: "405%",
  },
  sessionNameText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    margin: "2%",
    marginBottom: "0%",
    marginTop: "1%",
    marginRight: "8%",
  },
  sessionInfoText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    margin: "2%",
    marginBottom: "0%",
    marginTop: "1%",
  },
  numContributorsContainer: {
    marginLeft: "-4%",
    marginTop: "-2%",
    flex: 1,
    flexDirection: "row",
  },
  numContributorsText: {
    fontFamily: "Quicksand-Bold",
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    marginTop: 16.3,
  },
  numContributorsIcon: {
    height: "60%",
    marginLeft: "4%",
    marginTop: 17.3,
  },
});
