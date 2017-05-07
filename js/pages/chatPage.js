import React from 'react';
import {View, Text, TextInput, Button, AsyncStorage, StyleSheet} from 'react-native';
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
        // AsyncStorage.getItem('user', (error, result) => {
        //     if (error) {
        //         return alert('没有user数据');
        //     }
        //     const user = JSON.parse(result);
        //     const {section} = props.navigation.state.params;
        //     const chatServer = `http://121.249.216.192:3000?room_id=${section._id}&user_id=${user._id}`;
        //     this.socket = Utils.getSocket(chatServer);
        //     this.socket.on('connect', () => {
        //         this.socket.on('chat-message', (msg) => this._handleReceive(msg));
        //     });
        // });
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
                    <Text>chatBox</Text>
                </View>
                <View style={styles.bottom}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(message) => this.setState({message})}
                        underlineColorAndroid={'transparent'}
                    />
                    <View style={styles.send}>
                        <Button
                            title="发送"
                            onPress={() => this._handleSend(this.state.message)}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    bottom: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 5
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        flex: 1
    },
    send: {
        width: 70
    }
});

export default ChatPage;