import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View, Text} from 'react-native';

class LikePage extends React.Component {
    static navigationOptions = {
        tabBarLabel: (o) => (
            <Icon name="heart" size={25} color={o.focused ? '#398DEE' : '#666'}/>
        )
    };
    render () {
        return (
            <View>
                <Text>LikePage</Text>
            </View>
        );
    }
}

export default LikePage;