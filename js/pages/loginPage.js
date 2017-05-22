import React from 'react';
import {TextInput, View, Button, AsyncStorage, StyleSheet, TouchableOpacity, Text, ToastAndroid} from 'react-native';
import settings from '../settings';
import Utils from '../utils';

class LoginPage extends React.Component {
    static navigationOptions = {
        header: null
    };
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }
    componentDidMount () {
        const navParams = this.props.navigation.state.params;
        if (navParams) {
            const {username, password} = navParams;
            this.setState({
                username,
                password
            });
        }
    }
    login () {
        if (!this._checkInput()) {
            return;
        }
        const {navigate} = this.props.navigation;
        const {username, password} = this.state;
        const {host, port} = settings.server;
        const loginApi = `http://${host}:${port}/api/sessions`;
        Utils.post(loginApi, {username, password}, (res) => {
            navigate('Root', {user: res});
            // asyncStorage
            AsyncStorage.setItem('user', JSON.stringify(res));
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
        return true;
    }
    _goRegisterPage () {
        const {navigate} = this.props.navigation;
        navigate('Register');
    }
    render () {
        return (
            <View style={styles.container}>
                <TextInput
                    value={this.state.username}
                    style={styles.input}
                    placeholder="用户名"
                    onChangeText={(text) => {this.setState({username: text})}}
                    underlineColorAndroid={'transparent'}
                />
                <TextInput
                    value={this.state.password}
                    style={styles.input}
                    placeholder="密码"
                    secureTextEntry={true}
                    onChangeText={(text) => {this.setState({password: text})}}
                    underlineColorAndroid={'transparent'}
                />
                <View style={styles.button}>
                    <Button raised={false} title="登录" onPress={() => {this.login()}}/>
                </View>
                <TouchableOpacity onPress={this._goRegisterPage.bind(this)}>
                    <Text style={styles.register}>没有账号？立即注册</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default LoginPage;

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
    },
    register: {
        alignSelf: 'center',
        marginVertical: 10,
        color: '#168ADD'
    }
});