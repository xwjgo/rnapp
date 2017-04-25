import React from 'react';
import {TextInput, View, Button} from 'react-native';
import settings from '../settings';
import Utils from '../utils';

class LoginPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            username: 'xwjxwj',
            password: '123123'
        }
    }
    login () {
        const {navigate} = this.props.navigation;
        const {username, password} = this.state;
        const {host, port} = settings.server;
        const loginApi = `http://${host}:${port}/api/sessions`;
        Utils.post(loginApi, {username, password}, (res) => {
            navigate('Home', {user: res});
        }, (err) => {
            alert(err.message);
        });
    }
    render () {
        return (
            <View>
                <TextInput
                    placeholder="用户名"
                    onChangeText={(text) => {this.setState({username: text})}}
                />
                <TextInput
                    placeholder="密码"
                    secureTextEntry={true}
                    onChangeText={(text) => {this.setState({password: text})}}
                />
                <Button title="登录" onPress={() => {this.login()}}/>
            </View>
        );
    }
}

export default LoginPage;