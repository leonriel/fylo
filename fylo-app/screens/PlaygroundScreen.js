import {
  StyleSheet,
  Text,
  Pressable,
  Image,
  TextInput,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";

const PlaygroundScreen = ({ user, sessions }) => {
  const [playgroundSessions, setPlaygroundSessions] = useState(sessions);

  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <SafeAreaView style={styles.headerContainer}>
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Text style={styles.headerText}>Home</Text>
          </Pressable>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require("../assets/icon.png")}
          />
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Text style={styles.headerText}>Camera</Text>
          </Pressable>
        </SafeAreaView>
        <SafeAreaView style={styles.subHeaderContainer}>
          <Text style={styles.headerText}>Albums</Text>
          <Pressable style={({ pressed }) => pressed && styles.pressedItem}>
            <Text style={styles.headerText}>Sort</Text>
          </Pressable>
        </SafeAreaView>
        <TextInput style={styles.searchBar} placeholder="Search" />
        <SafeAreaView>
          <ScrollView
            contentContainerStyle={styles.sessionsContainer}
            alwaysBounceVertical={true}
          >
            {playgroundSessions.map((session) => (
              <SafeAreaView key={session._id} style={styles.sessionCard}>
                <Pressable
                  style={({ pressed }) => pressed && styles.pressedItem}
                >
                  <ImageBackground
                    imageStyle={styles.sessionImage}
                    style={styles.sessionCard}
                    source={require("../assets/icon.png")}
                  >
                    <SafeAreaView style={styles.sessionActivityContainer}>
                      <Image
                        style={styles.sessionActiveIcon}
                        source={require("../assets/favicon.png")}
                      />
                      <Text style={[styles.sessionActivityText, { flex: 5 }]}>
                        Currently Active
                      </Text>
                      <Text style={styles.sessionActivityText}>Exit</Text>
                    </SafeAreaView>
                    <SafeAreaView style={styles.sessionInfoContainer}>
                      <Text style={[styles.sessionInfoText, { flex: 1 }]}>
                        {session.name}
                      </Text>
                      <SafeAreaView style={styles.numContributorsContainer}>
                        <Text style={[styles.numContributorsText, { flex: 1 }]}>
                          Num
                        </Text>
                        <Image
                          style={styles.numContributorsIcon}
                          source={require("../assets/favicon.png")}
                        />
                      </SafeAreaView>
                      <Text style={[styles.sessionInfoText, { flex: 1 }]}>
                        Date | # Pics
                      </Text>
                    </SafeAreaView>
                  </ImageBackground>
                </Pressable>
              </SafeAreaView>
            ))}
          </ScrollView>
        </SafeAreaView>
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
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "15%",
    marginHorizontal: 16,
  },
  subHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 11,
  },
  pressedItem: {
    opacity: 0.5,
  },
  headerText: {
    fontFamily: "Quicksand-Regular",
    fontWeight: "bold",
    fontSize: 24,
    color: "white",
  },
  logo: {
    width: "50%",
    height: "90%",
    marginHorizontal: 16,
    marginTop: 4,
  },
  searchBar: {
    margin: 10,
    backgroundColor: "white",
    height: "6%",
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
    // justifyContent: "center",
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
    // fontSize: 16,
    color: "white",
    margin: "2%",
  },
  sessionActiveIcon: {
    flex: 1,
    height: "100%",
    resizeMode: "contain",
    marginRight: "-4%",
  },
  sessionInfoContainer: {
    marginVertical: "14.5%",
    backgroundColor: "rgba(121, 160, 212, 0.5)",
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: "405%",
  },
  sessionInfoText: {
    fontFamily: "Quicksand-Regular",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
    margin: "2%",
    marginBottom: "0%",
    marginTop: "1%",
  },
  numContributorsText: {
    fontFamily: "Quicksand-Regular",
    fontWeight: "bold",
    fontSize: 14,
    color: "white",
    marginTop: "14%",
    marginBottom: "0%",
  },
  numContributorsContainer: {
    marginLeft: "-5%",
    marginTop: "-2%",
    flex: 1,
    flexDirection: "row",
    // alignContent: "flex-start",
  },
  numContributorsIcon: {
    flex: 1,
    height: "60%",
    resizeMode: "contain",
    marginLeft: "-130%",
    marginTop: "10%",
  },
});
