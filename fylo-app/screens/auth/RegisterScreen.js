import { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, Modal, Alert } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const { signUp, verifyUser } = useContext(AuthContext);

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);

    const [verificationCode, setVerificationCode] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const handleSignUp = () => {
        signUp(username, email, phone, password);
        setModalVisible(true);
    }
    
    const handleVerification = () => {
        verifyUser(username, verificationCode);
        setModalVisible(false);
        navigation.navigate("Login");
        return Alert.alert("You've been registered! Please login");
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Username</Text>
            <TextInput style={styles.input} onChangeText={(text) => setUsername(text)} value={username} />
            <Text>Email</Text>
            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} value={email} />
            <Text>Phone Number</Text>
            <TextInput keyboardType="number-pad" style={styles.input} onChangeText={(text) => setPhone(text)} value={phone} />
            <Text>Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} value={password} />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Go to login" onPress={() => navigation.navigate('Login')} />
            <Modal
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={styles.container}>
                    <Text>Please input the verification code sent to your email</Text>
                    <TextInput style={styles.input} onChangeText={(text) => setVerificationCode(text)} />
                    <Button title="Verify" onPress={handleVerification} />
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
        borderBottomWidth: 2,
        margin: 8,
        padding: 2,
        fontSize: 16
    }
});

export default RegisterScreen;