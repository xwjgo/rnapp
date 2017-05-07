import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

class MessageItem extends React.Component {
    render () {
        const data = this.props.data;
        return (data.message ?
            <View>
                <Text>{data.username}: {data.message}</Text>
            </View> :
            <View>
                <Text>{data.username} connect</Text>
            </View>
        );
    }
}

export default MessageItem;
