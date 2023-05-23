import { Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
    return (
        <>
            <Button title="Go to register" onPress={() => navigation.navigate('Register')} />
            <Button title="Go to login" onPress={() => navigation.navigate('Login')} />
        </>
    );
}

export default HomeScreen;