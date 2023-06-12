import { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Input from '../../components/Input';
import Button from'../../components/Button';
import { AuthContext } from '../../contexts/AuthContext';

const SignInScreen = ({ navigation }) => {
    const { signIn } = useContext(AuthContext)
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [activityIndicator, setActivityIndicator] = useState(false);

    const handleSignIn = async () => {
        setActivityIndicator(true);
        await signIn(username, password);
        setActivityIndicator(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Sign In</Text>
            <Input label="USERNAME, EMAIL, OR PHONE" width="80%" value={username} handler={(text) => setUsername(text)} secureTextEntry={false} />
            <Input label="PASSWORD" width="80%" value={password} handler={(text) => setPassword(text)} secureTextEntry={true} />
            <Button     
                borderRadius="25%"
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Sign In"
                margin={24}
                handler={handleSignIn}
            />
            {activityIndicator && <ActivityIndicator />}
        </SafeAreaView>
    );
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
});

export default SignInScreen;