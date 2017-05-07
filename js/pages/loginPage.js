import React from 'react';
import {TextInput, View, Button, AsyncStorage, StyleSheet} from 'react-native';
import settings from '../settings';
import Utils from '../utils';

class LoginPage extends React.Component {
    static navigationOptions = {
        headerVisible: false
    }
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
            // asyncStorage
            AsyncStorage.setItem('user', JSON.stringify(res));
        }, (err) => {
            alert(err.message);
        });
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
                <View style={styles.button}>
                    <Button raised={false} title="登录" onPress={() => {this.login()}}/>
                </View>
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
    }
});