import { Text, StyleSheet, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const PlaygroundScreen = ({ user, sessions }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#E37E56", "#DE8E3E", "#5EC4CD"]}
        style={styles.gradient}
      ></LinearGradient>
      <SafeAreaView style={styles.banner}>
        <SafeAreaView style={styles.profileContainer}>
          <Image
            source={require("../assets/adaptive-icon.png")}
            style={styles.profileImage}
          />
        </SafeAreaView>
        <SafeAreaView style={styles.logoContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={styles.logoImage}
          />
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.startContainer}>
        <Text style={styles.startText}>Start</Text>
        <SafeAreaView>
          <Pressable>
            <Image
              source={require("../assets/adaptive-icon.png")}
              style={styles.startImage}
            />
          </Pressable>
        </SafeAreaView>
        <Text style={styles.sessionText}>Session</Text>
      </SafeAreaView>
      {/* <Modal> */}

      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.myFyloFlicsText}>my fyloflics</Text>
        <Text style={styles.myFyloFlicsText}>^</Text>
        <Text style={styles.swipeUpText}>swipe up</Text>
      </SafeAreaView>
    </SafeAreaView>

    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    position: "relative",
  },

  gradient: {
    transform: [{ rotate: "-20deg" }],
    position: "absolute",
    width: 800,
    height: 1000,
    marginVertical: -80,
    marginHorizontal: -150,
  },

  banner: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },

  profileContainer: {
    height: 47,
    width: 47,
    alignItems: "center",
    justifyContent: "center",
  },

  profileImage: {
    height: 47,
    width: 47,
    marginLeft: 30,
    marginTop: 100,
    resizeMode: "contain",
    borderRadius: 47 / 2,
    borderWidth: 3,
    borderColor: "white",
  },

  logoContainer: {
    width: "100%",
    marginLeft: -47,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    display: "flex",
  },

  logoImage: {
    marginTop: 65,
    height: 24.1,
    width: 74,
    resizeMode: "contain",
  },

  startContainer: {
    marginTop: 400,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  startText: {
    fontSize: 36,
    marginTop: -150,
    color: "white",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "Quicksand-Bold",
  },

  startImage: {
    width: 168,
    height: 168,
    borderRadius: 160 / 2,
    borderWidth: 5,
    borderColor: "white",
  },

  sessionText: {
    fontSize: 36,
    marginTop: 5,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Quicksand-Bold",
  },

  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: "30%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    height: 136,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  myFyloFlicsText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
    fontFamily: "Quicksand-Bold",
  },

  swipeUpText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Quicksand-Bold",
    fontWeight: 700,
  },
});

export default PlaygroundScreen;
