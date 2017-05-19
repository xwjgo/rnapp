import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import * as actionCreators from '../state/actions';
import {bindActionCreators} from 'redux';
import {View, Text, TextInput, Button, AsyncStorage, StyleSheet, FlatList} from 'react-native';
import MessageItem from '../components/messageItem';
import Utils from '../utils';
import settings from '../settings';
import Constants from '../Constants';

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
        };
        this.sectionId = props.navigation.state.params.section._id;
        // 用户事件 enter_chat_room
        this.componentDidMount = this.componentDidMount.after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.enter_chat_room
        }));
        // 用户事件 create_chat_message
        this._handleSend = this._handleSend.after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.create_chat_message
        }));
    }
    componentDidMount () {
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return alert('没有user数据');
            }
            const user = JSON.parse(result);
            const {host, port} = settings.server;
            const chatServer = `http://${host}:${port}?room_id=${this.sectionId}&username=${user.username}`;
            const {socket, isNewSocket} = Utils.getSocket(chatServer);
            this.socket = socket;
            if (!isNewSocket) {
                return;
            }
            // 监听join
            this.socket.on('join', (data) => this._handleReceive(data));
            // 监听chat-message
            this.socket.on('chat-message', (data) => this._handleReceive(data));
            // 监听 new-number
            this.socket.on('new-number', (number) => this.props.actions.updateNumber(this.sectionId, number));
            // 监听leave
            this.socket.on('leave', (data) => this._handleReceive(data));
            // 自己断开连接
            this.socket.on('disconnect', () => this._handleReceive({
                type: 'leave',
                username: user.username
            }));
        });
    }
    _handleReceive (data) {
        this.props.actions.addSocketData(this.sectionId, data);
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
        const socketData = this.props.socketData[this.sectionId];
        _.forEach(socketData, (item) => {
            item.key = _.uniqueId();
        });
        return (
            <View style={styles.container}>
                <Text style={styles.numberBox}>
                    共
                    <Text style={styles.number}>{this.props.number[this.sectionId]}</Text>
                    人在线
                </Text>
                <View>
                    <FlatList
                        ref={(ref) => {this._flatList = ref}}
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
        justifyContent: 'flex-end',
        marginTop: 80,
        padding: 5
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
    },
    numberBox: {
       alignSelf: 'center'
    },
    number: {
        color: 'red'
    }
});

const mapStateToProps = (state) => ({
    socketData: state.socketData,
    number: state.number
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);