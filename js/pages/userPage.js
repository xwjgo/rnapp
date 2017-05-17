import React from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View, Text, Button, TouchableOpacity, AsyncStorage} from 'react-native';
import Utils from '../utils';
import settings from '../settings';

class UserPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            user: null
        }
    }
    static navigationOptions = {
        tabBarLabel: (o) => (
            <Icon name="user" size={25}/>
        )
    };
    componentDidMount () {
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return;
            }
            const user = JSON.parse(result);
            this.setState({
                user
            });
        });
    }
    _logout () {
        const {host, port} = settings.server;
        const userApi = `http://${host}:${port}/api/sessions`;
        Utils.delete(userApi, {}, () => {
            const navigationAction = NavigationActions.navigate({
                routeName: 'Login'
            });
            this.props.dispatch(navigationAction);
        }, (error) => {
            alert(error.message);
        });
    }
    _goLikePage () {
        const {navigate} = this.props.navigation;
        navigate('Like');
    }
    render () {
        return (this.state.user &&
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>个人中心</Text>
                </View>
                <View style={styles.usernameBox}>
                    <Text style={styles.username}>{this.state.user.username}</Text>
                </View>
                <TouchableOpacity style={styles.likeBox} onPress={this._goLikePage.bind(this)}>
                    <Text style={styles.like}>我的收藏</Text>
                    <Text>共{this.state.user.likes.length}篇</Text>
                </TouchableOpacity>
                <View style={styles.buttonBox}>
                    <Button
                        title="退出登陆"
                        onPress={this._logout.bind(this)}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        paddingLeft: 10,
        color: '#fff'
    },
    usernameBox: {
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    username: {
        fontSize: 20,
        color: '#2196F3'
    },
    likeBox: {
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#D7D7D7'
    },
    like: {
        fontSize: 16,
        color: '#333'
    },
    buttonBox: {
        marginTop: 20
    }
});

export default connect()(UserPage);
