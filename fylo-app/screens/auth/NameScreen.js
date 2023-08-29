import { useState } from 'react';
import { TextInput, Text, View, SafeAreaView, Pressable, StyleSheet } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';

const NameScreen = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return (
        <SafeAreaView style={styles.container}>
           <Text style={styles.title}>What's your name?</Text>
           <Input label="First Name" width="80%" value={firstName} handler={(text) => setFirstName(text)} secureTextEntry={false} />
           <Input label="Last Name" width="80%" value={lastName} handler={(text) => setLastName(text)} secureTextEntry={false} />
           <Button     
                borderRadius={20}
                backgroundColor="#E8763A"
                height={30}
                aspectRatio={"3/1"}
                fontFamily="Quicksand-SemiBold"
                fontSize={16}
                fontColor="white"
                text="Continue"
                margin={24}
                handler={() => navigation.navigate('Sign Up 2', {firstName: firstName.trim(), lastName: lastName.trim()})}
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
    }
})

export default NameScreen;