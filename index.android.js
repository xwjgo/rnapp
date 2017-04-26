import {AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import HomePage from './js/pages/homePage';
import ContentListPage from './js/pages/contentListPage';
import ChapterListPage from './js/pages/chapterListPage';
import ContentDetailPage from './js/pages/contentDetailPage';
import LoginPage from './js/pages/loginPage';

const RnApp = StackNavigator({
    Home: {screen: HomePage},
    ContentList: {screen: ContentListPage},
    ChapterList: {screen: ChapterListPage},
    ContentDetail: {screen: ContentDetailPage},
    Login: {screen: LoginPage},
}, {
    initialRouteName: 'Login'
});

AppRegistry.registerComponent('RnApp', () => RnApp);
