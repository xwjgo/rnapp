import React from 'react';
import {createStore, combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';
import {AppRegistry} from 'react-native';
import {StackNavigator, addNavigationHelpers} from 'react-navigation';
import {socketData, number} from './js/state/reducers';
import HomePage from './js/pages/homePage';
import ContentListPage from './js/pages/contentListPage';
import ChapterListPage from './js/pages/chapterListPage';
import ContentDetailPage from './js/pages/contentDetailPage';
import ChatPage from './js/pages/chatPage';
import LoginPage from './js/pages/loginPage';
import CommentPage from './js/pages/commentPage';
import RegisterPage from './js/pages/registerPage';

const AppNavigator = StackNavigator({
    Home: {screen: HomePage},
    ContentList: {screen: ContentListPage},
    ChapterList: {screen: ChapterListPage},
    ContentDetail: {screen: ContentDetailPage},
    Chat: {screen: ChatPage},
    Login: {screen: LoginPage},
    Comment: {screen: CommentPage},
    Register: {screen: RegisterPage}
}, {
    initialRouteName: 'Login'
});

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('Login'));
const navReducer = (state = initialState, action) => {
    const nextState = AppNavigator.router.getStateForAction(action, state);
    return nextState || state;
};
const appReducer = combineReducers({
    nav: navReducer,
    socketData,
    number
});

class App extends React.Component {
    render () {
        return <AppNavigator navigation={addNavigationHelpers({
            dispatch: this.props.dispatch,
            state: this.props.nav
        })}/>
    }
}

const mapStateToProps = (state) => ({
    nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);
const store = createStore(appReducer);

class RnApp extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('RnApp', () => RnApp);
