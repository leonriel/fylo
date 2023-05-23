import { Button } from 'react-native';

const LoginScreen = ({ navigation }) => {
    return (
        <>
            <Button title="Go to register" onPress={() => navigation.navigate('Register')} />
            <Button title="Go to home" onPress={() => navigation.navigate('Home')} />
        </>
    );
}

export default LoginScreen;