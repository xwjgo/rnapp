import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, ToastAndroid} from 'react-native';
import Utils from '../utils';
import settings from '../settings';

class RegisterPage extends React.Component {
    static navigationOptions = {
        title: '用户注册'
    };
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            passwordConfirm: ''
        }
    }
    register () {
        // 输入校验
        if (!this._checkInput()) {
            return;
        }
        const {navigate} = this.props.navigation;
        const {host, port} = settings.server;
        const userApi = `http://${host}:${port}/api/users`;
        Utils.post(userApi, {
            username: this.state.username,
            password: this.state.password
        }, (res) => {
            ToastAndroid.showWithGravity('注册成功!', ToastAndroid.SHORT, ToastAndroid.CENTER);
            navigate('Login', {username: this.state.username, password: this.state.password});
        }, (err) => {
            alert(err.message);
        });
    }
    _checkInput () {
        const usernameRxp = /^\w{3,15}$/;
        const passwordRxp = /^\w{5,15}$/;
        if (!usernameRxp.test(this.state.username)) {
            ToastAndroid.showWithGravity('用户名必须为3-15位字符', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return false;
        }
        if (!passwordRxp.test(this.state.password)) {
            ToastAndroid.showWithGravity('密码必须为5-15位字符', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return false;
        }
        if (this.state.password !== this.state.passwordConfirm) {
            ToastAndroid.showWithGravity('两次输入密码不一致', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return false;
        }
        return true;
    }
    render () {
        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="用户名"
                    onChangeText={(text) => {this.setState({username: text})}}
                    underlineColorAndroid={'transparent'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="密码"
                    secureTextEntry={true}
                    onChangeText={(text) => {this.setState({password: text})}}
                    underlineColorAndroid={'transparent'}
                />
                <TextInput
                    style={styles.input}
                    placeholder="确认密码"
                    secureTextEntry={true}
                    onChangeText={(text) => {this.setState({passwordConfirm: text})}}
                    underlineColorAndroid={'transparent'}
                />
                <View style={styles.button}>
                    <Button raised={false} title="注册" onPress={this.register.bind(this)}/>
                </View>
            </View>
        );
    }
}

export default RegisterPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 5
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginVertical: 5
    },
    button: {
        marginVertical: 5
    }
});
