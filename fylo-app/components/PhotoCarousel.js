// import { useState } from 'react';
import { Modal, SafeAreaView, FlatList, View, Dimensions, Button, ScrollView } from 'react-native';
// import { Image } from 'expo-image';
import FastImage from 'react-native-fast-image';

// TODO: Add share and download functionalities

const PhotoCarousel = ({photos, visible, handler, offset}) => {
    const totalItemWidth = Dimensions.get('window').width + 20

    return (
        <Modal
            animationType="slide"
            visible={visible}
            onRequestClose={handler}
        >
            <FlatList
                data={photos}
                renderItem={({item}) => {
                    return (
                        <FastImage resizeMode={FastImage.resizeMode.contain} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} source={{uri: item.uri}} />
                    )
                }}
                ItemSeparatorComponent={() => <View style={{width: 20}} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={totalItemWidth}
                disableIntervalMomentum
                contentOffset={{x: totalItemWidth * offset, y: 0}}
                getItemLayout={(data, index) => ({
                    length: totalItemWidth,
                    offset: totalItemWidth * index,
                    index
                })}
                // pagingEnabled={true} 
            />
            <Button title="Close" onPress={handler} />
        </Modal>
    )
}

export default PhotoCarousel;