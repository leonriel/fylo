import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, Alert } from 'react-native';
import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
} from 'amazon-cognito-identity-js';

import { USER_POOL_ID, CLIENT_ID } from '@env';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [password, setPassword] = useState(null);

    let poolData = {
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID
    }

    let userPool = new CognitoUserPool(poolData);

    const onRegister = () => {
        console.log(username, email, phone, password);
        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: 'fylo.proj@gmail.com'
        }
    
        let dataPhoneNumber = {
            Name: 'phone_number',
            Value: '+13608909433'
        }
    
        let attributeEmail = new CognitoUserAttribute(dataEmail);
        let attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        userPool.signUp('fylo', 'Abcdefg!1', attributeList, null, function(
            err,
            result
        ) {
            if (err) {
                return Alert.alert(err.message || JSON.stringify(err));
            }
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });
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
            <Button title="Sign Up" onPress={onRegister} />
            <Button title="Go to login" onPress={() => navigation.navigate('Login')} />
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

export default RegisterScreen;