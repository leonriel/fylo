import { Dimensions, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const Square = ({id, handler}) => {
    const pressed = useSharedValue(false);

    const tapGesture = Gesture.Tap()
        .onTouchesUp(() => {
            pressed.value = !pressed.value
        })
        // .onTouchesUp(handler)

    const screenWidth = Dimensions.get('window').width

    const uas = useAnimatedStyle(() => {
        return {
            minWidth: withTiming(pressed.value ? screenWidth : screenWidth / 4),
            maxWidth: withTiming(pressed.value ? screenWidth : screenWidth / 4)
            // height: withTiming(pressed.value ? 100 : 50)
        }
    })

    let gap;

    if (id % 4 != 1) {
        gap = {paddingLeft: 1}
    }

    return (
        <GestureDetector gesture={tapGesture}>
            <Animated.View style={[{flex: 1, aspectRatio: 1, minWidth: Dimensions.get('window').width / 4, maxWidth: Dimensions.get('window').width / 4, ...gap}, uas]}>
                <View style={[{height: "100%", width: "100%", backgroundColor: "red"}]} />
            </Animated.View>
            {/* <Animated.View style={[{height: 50, width: 50, backgroundColor: "red"}, uas]}>
                <View style={[{height: "100%", width: "100%", backgroundColor:"blue"}]} />
            </Animated.View> */}
        </GestureDetector>
    )
}

export default Square;