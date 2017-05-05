import React from 'react';
import {View, Text} from 'react-native';

class ChatPage extends React.Component {
    static navigationOptions ({navigation}) {
        const {section} = navigation.state.params;
        return {
            title: `${section.title}聊天室`
        }
    }
    render () {
        return (
            <View>
                <Text>chatPage</Text>
            </View>
        );
    }
}

export default ChatPage;