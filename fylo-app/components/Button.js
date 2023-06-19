import { Pressable, View, Text, StyleSheet } from 'react-native';

// Types
// borderRadius: String
// backgroundColor: String
// margin: Number
// height: Number
// aspectRatio: String
// fontFamily: String
// fontColor: String
// fontSize: String
// text: String
// handler: Callback

const Button = ({borderRadius, backgroundColor, margin, marginRight, marginTop, height, aspectRatio, fontFamily, fontColor, fontSize, text, handler}) => {
    return (
        <Pressable onPress={handler}>
            <View style={{
                ...styles.button,
                backgroundColor: backgroundColor,
                height: height,
                aspectRatio: aspectRatio,
                borderRadius: borderRadius,
                margin: margin,
                marginRight: marginRight,
                marginTop: marginTop
            }}>
                <Text style={{
                    fontFamily: fontFamily,
                    color: fontColor,
                    fontSize: fontSize
                }}>{text}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center"
    }
})

export default Button;