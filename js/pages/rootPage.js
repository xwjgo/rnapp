import React from 'react';
import {TabNavigator} from 'react-navigation';
import HomePage from './homePage';
import LikePage from './likePage';
import UserPage from './userPage';

class RootPage extends React.Component {
    static navigationOptions = {
        headerVisible: false
    };
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
       return (this._genBottomTab());
    }
}

export default RootPage;
