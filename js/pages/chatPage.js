import _ from 'lodash';
import React from 'react';
import {View, Text, TextInput, Button, AsyncStorage, StyleSheet, FlatList} from 'react-native';
import MessageItem from '../components/messageItem';
import Utils from '../utils';
import settings from '../settings';

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
            message: '',
            socketData: []
        };
    }
    componentDidMount () {
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return alert('没有user数据');
            }
            const user = JSON.parse(result);
            const {section} = this.props.navigation.state.params;
            const chatServer = `http://121.249.216.192:3000?room_id=${section._id}&username=${user.username}`;
            this.socket = Utils.getSocket(chatServer);
            // 监听join
            this.socket.on('join', (data) => this._handleReceive(data));
            // 监听chat-message
            this.socket.on('chat-message', (data) => this._handleReceive(data));
            // 监听leave
            this.socket.on('leave', (data) => this._handleReceive(data));
        });
    }
    componentWillUnmount () {
        this.socket.off();
    }
    _handleReceive (data) {
        const newData = _.cloneDeep(this.state.socketData);
        newData.push(data);
        this.setState({
            socketData: newData
        });
    }
    _handleSend (message) {
        if (!message.trim()) {
            return;
        }
        this.socket.emit('chat-message', message);
        this.setState({
            message: ''
        });
    }
    render () {
        const socketData = this.state.socketData;
        _.forEach(socketData, (item) => {
            item.key = _.uniqueId();
        });
        return (
            <View style={styles.container}>
                <Text>chatBox</Text>
                <View>
                    <FlatList
                        data={socketData}
                        renderItem={({item}) => <MessageItem data={item}/>}
                        keyExtractor={item => _.uniqueId()}
                    />
                </View>
                <View style={styles.bottom}>
                    <TextInput
                        style={styles.input}
                        onChangeText={(message) => this.setState({message})}
                        value={this.state.message}
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
        width: 70,
        justifyContent: 'center',
        marginLeft: 5
    }
});

export default ChatPage;