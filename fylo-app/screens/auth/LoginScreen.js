import { useState, useContext } from 'react';
import { SafeAreaView, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';


const LoginScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext)
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const onLogin = () => {
        signIn(username, password);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text>Username</Text>
            <TextInput style={styles.input} onChangeText={(text) => setUsername(text)} value={username} />
            <Text>Password</Text>
            <TextInput secureTextEntry={true} style={styles.input} onChangeText={(text) => setPassword(text)} value={password} />
            <Button title="Login" onPress={onLogin} />
            <Button title="Go to register" onPress={() => navigation.navigate('Register')} />
            <Button title="Go to home" onPress={() => navigation.navigate('Home')} />
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

export default LoginScreen;