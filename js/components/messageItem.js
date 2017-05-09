import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

class MessageItem extends React.Component {
    render () {
        const data = this.props.data;
        switch (data.type) {
            case 'join':
                return (
                    <View style={styles.hintBox}>
                        <Text style={styles.hint}>{data.username} 进入聊天室</Text>
                    </View>
                );
            case 'leave':
                return (
                    <View style={styles.hintBox}>
                        <Text style={styles.hint}>{data.username} 离开聊天室</Text>
                    </View>
                );
            case 'chat-message':
                return (
                    <View style={styles.messageBox}>
                        <Text>{data.username}:</Text>
                        <Text style={styles.message}>{data.message}</Text>
                    </View>
                );
            default:
                return null;
        }
    }
}

const styles = StyleSheet.create({
    messageBox: {
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        alignItems: 'center'
    },
    message: {
        color: '#343434',
        fontSize: 16,
        borderRadius: 5,
        backgroundColor: '#9FE658',
        padding: 10,
        marginHorizontal: 10,
        maxWidth: 250
    },
    hintBox: {
        alignSelf: 'center'
    },
    hint: {
        color: '#FFF',
        backgroundColor: '#D4D4D4',
        margin: 5,
        borderRadius: 5,
        padding: 5
    }
});

export default MessageItem;
