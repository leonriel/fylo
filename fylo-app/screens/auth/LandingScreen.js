import { SafeAreaView, View, Dimensions, StyleSheet } from 'react-native';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';
import Button from '../../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const LandingScreen = ({navigation}) => {
    return (
        <View style={{flex: 1}}>
            <LinearGradient colors={["#5DC3CC", "#A39C83", "#E8763A"]} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}>
                <SafeAreaView style={{flex: 1, justifyContent: "center"}}>
                    <FastImage style={{height: 50, aspectRatio: "228/76", alignSelf: "center", margin: 16}} source={require("../../assets/logo-white.png")} />
                    <Button 
                        borderRadius={50}
                        height={50}
                        aspectRatio="5/1"
                        margin={16}
                        backgroundColor="white"
                        fontFamily="Quicksand-Bold"
                        fontSize={24}
                        fontColor="#489D9C"
                        text="Sign Up"
                        handler={() => navigation.navigate("Sign Up 1")}
                    />
                    <Button 
                        borderRadius={40}
                        height={50}
                        aspectRatio="5/1"
                        margin={0}
                        backgroundColor="#DB5735"
                        fontFamily="Quicksand-Bold"
                        fontSize={16}
                        fontColor="white"
                        text="I already have an account"
                        handler={() => navigation.navigate("Sign In")}
                    />
                </SafeAreaView>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 50,
        aspectRatio: "5/1",
        borderRadius: "25%",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    },
    text: {
        fontFamily: 'Quicksand-Bold',
    }
})

export default LandingScreen;