import { useState, useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { Auth } from 'aws-amplify';
import axios from 'axios';

const VerificationScreen = ({route, navigation}) => {
    const [code, setCode] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

    const { autoSignIn } = useContext(AuthContext);

    const { firstName, lastName, username, cognitoUsername, email, phoneNumber, cognitoUserSub } = route.params;

    const handleVerification = async () => {
        setActivityIndicator(true);
        try {
            await Auth.confirmSignUp(cognitoUsername, code, { forceAliasCreation: false });
            try {
                await axios.post("https://fylo-app-server.herokuapp.com/user/create", {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    cognitoUserSub: cognitoUserSub
                });
            } catch (error) {
                console.log(error);
            }
            await autoSignIn(username);
        } catch (error) {
            console.log(error);
        }
        setActivityIndicator(false);
    }

    const handleResendVerification = async () => {
        try {
            await Auth.resendSignUp(cognitoUsername);
            console.log('sent');
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
           <Text style={styles.title}>Enter the code we sent to your email.</Text>
           <Input label="VERIFICATION CODE" width="80%" keyboardType="number-pad" value={code} handler={(text) => setCode(text)} secureTextEntry={false} />
           <Button     
                borderRadius="25%"
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Verify"
                margin={24}
                handler={handleVerification}
            />
            <Button     
                borderRadius="25%"
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Resend Verifiation"
                margin={24}
                handler={handleResendVerification}
            />
            {activityIndicator && <ActivityIndicator />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    title: {
        fontFamily: "Quicksand-Regular",
        fontSize: 24,
        marginBottom: 32,
        marginTop: 32
    }
})

export default VerificationScreen;