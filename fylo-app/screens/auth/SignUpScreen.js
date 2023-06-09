import { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, Modal, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Auth } from 'aws-amplify';

const SignUpScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext);
    const [username, setUsername] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);

    const [verificationCode, setVerificationCode] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const handleSignUp = async () => {
        try {
            const { user } = await Auth.signUp({
                username: username.toLowerCase(),
                password: password,
                attributes: {
                    email: email.toLowerCase(),
                    phone_number: '+1' + phone,
                    preferred_username: username.toLowerCase()
                },
                autoSignIn: {
                    enabled: false
                }
            });
            console.log(user);
            setModalVisible(true);
        } catch (error) {
            console.log(error);
        }
    }
    
    const handleVerification = async () => {
        try {
            await Auth.confirmSignUp(username.toLowerCase(), verificationCode);
            await axios.post("https://fylo-app-server.herokuapp.com/user/create", {
                username: username,
                firstName: firstName,
                lastName: lastName
            });
            setModalVisible(false);
            navigation.navigate("Sign In");
            return Alert.alert("You've been registered!");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Username</Text>
            <TextInput style={styles.input} onChangeText={(text) => setUsername(text)} value={username} />
            <Text>First Name</Text>
            <TextInput style={styles.input} onChangeText={(text) => setFirstName(text)} value={firstName} />
            <Text>Last Name</Text>
            <TextInput style={styles.input} onChangeText={(text) => setLastName(text)} value={lastName} />
            <Text>Email</Text>
            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} value={email} />
            <Text>Phone Number</Text>
            <TextInput keyboardType="number-pad" style={styles.input} onChangeText={(text) => setPhone(text)} value={phone} />
            <Text>Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} value={password} />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Go to sign in" onPress={() => navigation.navigate('Sign In')} />
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.container}>
                    <Text>Please input the verification code sent to your email</Text>
                    <TextInput keyboardType="number-pad" style={styles.input} onChangeText={(text) => setVerificationCode(text)} />
                    <Button title="Verify" onPress={handleVerification} />
                    <Button title="Close" onPress={() => setModalVisible(false)} />
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 8
    },
    input: {
        width: '80%',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        margin: 8,
        padding: 8,
        fontSize: 16
    },
});

export default SignUpScreen;