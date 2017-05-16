import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View, Text} from 'react-native';

class UserPage extends React.Component {
    static navigationOptions = {
        tabBarLabel: (o) => (
            <Icon name="user" size={25} color={o.focused ? '#398DEE' : '#666'}/>
        )
    };
    render () {
        return (
            <View>
                <Text>UserPage</Text>
            </View>
        );
    }
}

export default UserPage;
