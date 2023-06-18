import { Text, View, StyleSheet, Pressable } from 'react-native';

// Types
// sessionName: String
// numContributors: Number
// button: Component

const SessionListItem = ({sessionName, numContributors, button1, button2}) => {
    return (
        <View style={styles.session}>
            <View style={styles.nameContainer}>
                <View>
                    <Text style={styles.name}>
                        {sessionName}
                    </Text>
                    <Text style={styles.contributors}>
                        {numContributors} {numContributors > 1 ? "contributors" : "contributor"}
                    </Text>
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
        fontSize: 16
    },
    contributors: {
        fontFamily: "Quicksand-Regular",
        fontSize: 12,
        color: "gray"
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default SessionListItem;