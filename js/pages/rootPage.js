import React from 'react';
import {TabNavigator} from 'react-navigation';
import HomePage from './homePage';
import LikePage from './likePage';
import UserPage from './userPage';
import Utils from '../utils';
import settings from '../settings';

class RootPage extends React.Component {
    static navigationOptions = {
        headerVisible: false
    };
    constructor (props) {
        super(props);
        this.state = {
            hasLogin: false
        }
    }
    componentDidMount () {
        const {host, port} = settings.server;
        const testApi = `http://${host}:${port}/api/categories`;
        Utils.get(testApi, (res) => {
            this.setState({
                hasLogin: true
            });
        }, (error) => {
            const {navigate} = this.props.navigation;
            navigate('Login');
        });
    }
    _genBottomTab () {
        const BottomTab = TabNavigator({
            Home: {screen: HomePage},
            Like: {screen: LikePage},
            User: {screen: UserPage}
        }, {
            tabBarPosition: 'bottom',
            swipeEnable: false,
            initialRouteName: 'Home',
            tabBarOptions: {
                indicatorStyle: {
                    display: 'none'
                },
                style: {
                    backgroundColor: '#FFF',
                    borderTopWidth: 1,
                    borderTopColor: '#D7D7D7',
                    paddingVertical: 5
                }
            }
        });
        return <BottomTab/>
    }
    render () {
       return (this.state.hasLogin && this._genBottomTab());
    }
}

export default RootPage;
