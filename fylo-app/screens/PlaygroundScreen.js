import { Text, StyleSheet, Image, Pressable, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const PlaygroundScreen = ({ navigation, user, sessions }) => {
  return (
    <View style={{height: Dimensions.get('window').height, width: Dimensions.get('window').width}}>
        <LinearGradient
            colors={["#E37E56", "#DE8E3E", "#5EC4CD"]}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.banner}>
                    <View style={styles.profileContainer}>
                        <Image
                            source={require("../assets/adaptive-icon.png")}
                            style={styles.profileImage}
                        />
                    </View>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require("../assets/icon.png")}
                            style={styles.logoImage}
                        />
                    </View>
                    <View style={{flex: 1}} />
                </View>
                <View style={{justifyContent: "space-between", height: "100%"}}>
                    <View style={{flex: 1}} />
                    <View style={styles.startContainer}>
                        <Text style={styles.startText}>Start</Text>
                        <View>
                        <Pressable>
                            <Image
                            source={require("../assets/adaptive-icon.png")}
                            style={styles.startImage}
                            />
                        </Pressable>
                        </View>
                        <Text style={styles.sessionText}>Session</Text>
                    </View>
                    {/* <Modal> */}

                    <View style={{flex: 1, flexDirection: "row"}}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.myFyloFlicsText}>my fyloflics</Text>
                            <Text style={styles.myFyloFlicsText}>^</Text>
                            <Text style={styles.swipeUpText}>swipe up</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    </View>

    // </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    // position: "relative",
  },

  gradient: {
    flex: 1
    // transform: [{ rotate: "-20deg" }],
    // position: "absolute",
    // width: 800,
    // height: 1000,
    // marginVertical: -80,
    // marginHorizontal: -150,
  },

  banner: {
    // display: "flex",
    flexDirection: "row",
    width: "100%",
  },

  profileContainer: {
    height: 47,
    width: 47,
    // alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  profileImage: {
    height: 47,
    width: 47,
    marginLeft: 30,
    // marginTop: 100,
    resizeMode: "contain",
    borderRadius: 47 / 2,
    borderWidth: 3,
    borderColor: "white",
  },

  logoContainer: {
    // width: "100%",
    // marginLeft: -47,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "relative",
    // display: "flex",
  },

  logoImage: {
    // marginTop: 65,
    height: 24.1,
    width: 74,
    // resizeMode: "contain",
  },

  startContainer: {
    // marginTop: 400,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },

  startText: {
    fontSize: 36,
    // marginTop: -150,
    color: "white",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
    fontFamily: "Quicksand-Bold",
  },

  startImage: {
    width: 168,
    height: 168,
    borderRadius: 168 / 2,
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
    // position: "absolute",
    // bottom: 0,
    // marginTop: 'auto',
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    opacity: "30%",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    height: 136,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginBottom: 70 // Because of the tab bar >:(
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
    // fontWeight: 700,
  },
});

export default PlaygroundScreen;
