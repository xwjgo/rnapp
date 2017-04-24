import React from 'react';
import {AppRegistry, StyleSheet, View, Text} from 'react-native';

class ContentDetailPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            title: navigation.state.params.user
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
