import { Text, View, StyleSheet } from 'react-native';

const ProfileIcon = ({firstName, lastName, extraStyles}) => {
    return (
        <View style={{...styles.initialsContainer, ...extraStyles}}>
            <Text style={styles.initials}>{firstName.charAt(0) + lastName.charAt(0)}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    initialsContainer: {
        backgroundColor: "white",
        borderColor: "blacK",
        borderWidth: 1,
        borderRadius: "50%",
        height: 25,
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    initials: {
        fontFamily: "Quicksand-SemiBold"
    }
})

export default ProfileIcon;