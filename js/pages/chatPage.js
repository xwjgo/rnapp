import React from 'react';
import {View, Text, TextInput, Button, AsyncStorage} from 'react-native';
import settings from '../settings';
import Utils from '../utils';

class ChatPage extends React.Component {
    static navigationOptions ({navigation}) {
        const {section} = navigation.state.params;
        return {
            title: `${section.title}聊天室`
        }
    }
    constructor (props) {
        super(props);
        this.state = {
            message: null
        };
        // const {host, port} = settings.server;
        // const chatServer = `http://${host}:${port}`;
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return alert('没有user数据');
            }
            const user = JSON.parse(result);
            const {section} = props.navigation.state.params;
            const chatServer = `http://121.249.216.192:3000?room_id=${section._id}&user_id=${user._id}`;
            this.socket = Utils.getSocket(chatServer);
            this.socket.on('connect', () => {
                this.socket.on('chat-message', (msg) => this._handleReceive(msg));
            });
        });
    }
    _handleReceive (msg) {
        alert(msg);
    }
    _handleSend (message) {
       this.socket.emit('chat-message', message);
    }
    render () {
        return (
            <View style={styles.container}>
                <View>

                </View>
                <View>
                    <TextInput
                        onChangeText={(message) => this.setState({message})}
                    />
                    <Button
                        title="发送"
                        onPress={() => this._handleSend(this.state.message)}
                    />
                </View>
            </View>
        );
    }
}

export default ChatPage;