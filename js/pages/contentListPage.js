import React from 'react';
import {AppRegistry, StyleSheet, View, Text, Button} from 'react-native';

class ContentListPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            title: navigation.state.params.user,
            headerRight: <Button title="Info"/>
        }
    }
    render () {
        console.log(this);
        return (
            <View>
                <Text>ContentListPage</Text>
            </View>
        );
    }
}

export default ContentListPage;
