import { Text, View, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Types
// sessionName: String
// numContributors: Number
// button: Component

const SessionListItem = ({sessionName, numContributors, button1, button2}) => {
    return (
        <View style={styles.session}>
            <View style={styles.nameContainer}>
                    <Text style={styles.name}>
                        {sessionName}
                    </Text>
                    <View style={styles.contributorsContainer}>
                        <Text style={styles.contributors}>
                            {numContributors}
                        </Text>
                        <MaterialIcons name="people-alt" size={20} color="black" />
                    </View>
            </View>
            <View style={styles.buttonContainer}>
                {button1} 
                {button2}               
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    session: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
        width: "100%",
        marginBottom: 8
    },
    nameContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    name: {
        fontFamily: "Quicksand-SemiBold",
        fontSize: 20,
        marginRight: 10
    },
    contributorsContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    contributors: {
        fontFamily: "Quicksand-SemiBold",
        fontSize: 20,
        color: "black",
        marginRight: 3
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default SessionListItem;