import React from 'react';
import {StyleSheet, View, Text, Button, FlatList} from 'react-native';

class CommentPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            title: '评论'
        }
    };
    render () {
        return (
            <View>
                <Text>CommentPage</Text>
            </View>
        );
    }
}

export default CommentPage;