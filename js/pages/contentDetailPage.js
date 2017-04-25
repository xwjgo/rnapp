import React from 'react';
import {AppRegistry, StyleSheet, View, Text} from 'react-native';

class ContentDetailPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            tabBarLabel: '列表'
        }
    }

    render () {
        return (
            <View>
                <Text>ContentDetailPage</Text>
            </View>
        );
    }
}

export default ContentDetailPage;
