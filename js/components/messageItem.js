import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

class MessageItem extends React.Component {
    render () {
        const data = this.props.data;
        switch (data.type) {
            case 'join':
                return (
                    <View>
                        <Text>{data.username} 进入聊天室</Text>
                    </View>
                );
            case 'leave':
                return (
                    <View>
                        <Text>{data.username} 离开聊天室</Text>
                    </View>
                );
            case 'chat-message':
                return (
                    <View>
                        <Text>{data.username}: {data.message}</Text>
                    </View>
                );
            default:
                return null;
        }
    }
}

export default MessageItem;
