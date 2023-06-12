import { useState } from 'react';
import { Text, SafeAreaView, Alert, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';

const CredentialsScreen = ({route, navigation}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleContinue = () => {
        if (username.length == 0) {
            return Alert.alert("Please input username.")
        }

        if (password.length < 8) {
            return Alert.alert("Password must be at least 8 character long.")
        }

        let hasUpperCase = /[A-Z]/.test(password);
        let hasLowerCase = /[a-z]/.test(password);
        let hasNumbers = /\d/.test(password);
        let hasNonalphas = /\W/.test(password);

        if (!hasUpperCase) return Alert.alert("Password must contain at least one uppercase letter.")
        if (!hasLowerCase) return Alert.alert("Password must contain at least one lowercase letter.")
        if (!hasNumbers) return Alert.alert("Password must contain at least one number.")
        if (!hasNonalphas) return Alert.alert("Password must contain at least one special character.")

        navigation.navigate('Sign Up 3', {
            firstName: route.params.firstName,
            lastName: route.params.lastName,
            username: username.toLowerCase(),
            password: password
        })
    }

    return (
        <SafeAreaView style={styles.container}>
           <Text style={styles.title}>Choose a username and password.</Text>
           <Input label="USERNAME" width="80%" value={username} handler={(text) => setUsername(text)} secureTextEntry={false} />
           <Input label="PASSWORD" width="80%" value={password} handler={(text) => setPassword(text)} secureTextEntry={true} />
           <Text style={styles.disclaimer}>Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.</Text>
           <Button     
                borderRadius="25%"
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Continue"
                margin={24}
                handler={handleContinue}
            />
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

export default CredentialsScreen;