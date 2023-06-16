import { useState } from 'react';
import { TextInput, Text, View, SafeAreaView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Auth } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

const ContactInfoScreen = ({route, navigation}) => {
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [uuid, setUuid] = useState(uuidv4());
    const [activityIndicator, setActivityIndicator] = useState(false);

    const { firstName, lastName, username, password } = route.params;

    const handleSignUp = async () => {
        setActivityIndicator(true);
        try {
            const { user, userSub } = await Auth.signUp({
                username: uuid,
                password: password,
                attributes: {
                    email: email.toLowerCase(),
                    phone_number: '+1' + phoneNumber,
                },
                validationData: {
                    preferred_username: username
                },
                autoSignIn: {
                    enabled: true
                }
            });
            navigation.navigate("Sign Up 4", {
                firstName: firstName,
                lastName: lastName,
                username: username,
                cognitoUsername: uuid,
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber,
                cognitoUserSub: userSub
            })
        } catch (error) {
            console.log(error);
        }
        setActivityIndicator(false);
    }

    return (
        <SafeAreaView style={styles.container}>
           <Text style={styles.title}>Finish Up With Your Contact Information</Text>
           <Input label="EMAIL" width="80%" value={email} handler={(text) => setEmail(text)} secureTextEntry={false} />
           <Input label="PHONE NUMBER" width="80%" value={phoneNumber} keyboardType="number-pad" handler={(text) => setPhoneNumber(text)} secureTextEntry={false} />
            <Text style={styles.disclaimer}>We will send a verification code to your email.</Text>
           <Button     
                borderRadius="25%"
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Finish"
                margin={24}
                handler={handleSignUp}
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
    },
    disclaimer: {
        fontFamily: "Quicksand-Regular",
        fontSize: 10,
        width: "80%"
    }
})

export default ContactInfoScreen;