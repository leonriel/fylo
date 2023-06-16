import { Text, View, StyleSheet, Pressable } from 'react-native';

// Types
// sessionName: String
// numContributors: Number
// button: Component
// handler: Callback

const SessionListItem = ({sessionName, numContributors, button, handler}) => {
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
            <Pressable onPress={handler}>
                {button}
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    session: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
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
    }
});

export default SessionListItem;