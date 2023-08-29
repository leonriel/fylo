import { Text, TextInput, View, StyleSheet } from 'react-native';

// Types
// label: String
// width: String
// fontSize: Number
// value: String
// handler: Callback
// secureTextEntry: Boolean

const Input = ({label, width, fontSize, value, placeholder, handler, secureTextEntry, keyboardType}) => {

    return (
        <View style={{...styles.inputContainer, width: width}}>
            <Text style={styles.label}>{label}</Text>
            <TextInput 
                secureTextEntry={secureTextEntry} 
                keyboardType={keyboardType || "default"} 
                style={{...styles.input, fontSize: fontSize}} 
                onChangeText={(text) => handler(text)} value={value} 
                placeholder={placeholder}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        margin: 8
    },
    label: {
        fontFamily: "Quicksand-Regular",
        fontSize: 10,
        marginBottom: 10

    },
    input: {
        width: "100%",
        borderBottomWidth: 1,
        paddingBottom: 2,
        fontSize: 16,
        fontFamily: "Quicksand-Regular"
    }
});

export default Input;