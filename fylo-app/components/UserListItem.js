import { Text, View, StyleSheet, Pressable } from 'react-native';
import ProfileIcon from './ProfileIcon';

// Types
// firstName: String
// lastName: String
// fullName: String
// username: String
// button: Component
// handler: Callback

const UserListItem = ({firstName, lastName, fullName, username, button}) => {
    return (
        <View style={styles.user}>
            <View style={styles.nameContainer}>
                <ProfileIcon firstName={firstName} lastName={lastName} extraStyles={{marginRight: 10}} />
                <View>
                    <Text style={styles.fullName}>
                        {fullName}
                    </Text>
                    <Text style={styles.username}>
                        {username}
                    </Text>
                </View>
            </View>
            <Pressable style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                {button}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    user: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignSelf: "center",
        alignContent: "center",
        marginTop: 8,
        marginBottom: 8
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    fullName: {
        fontFamily: "Quicksand-SemiBold",
        fontSize: 16
    },
    username: {
        fontFamily: "Quicksand-Regular",
        fontSize: 12,
        color: "gray"
    }
});

export default UserListItem;