import React from 'react';
import {AppRegistry, Text, View} from 'react-native';

import {StackNavigator} from 'react-navigation';
import HomePage from './js/pages/homePage';
import ContentListPage from './js/pages/contentListPage';
import ContentDetailPage from './js/pages/contentDetailPage';

const RnApp = StackNavigator({
    Home: {screen: HomePage},
    ContentList: {screen: ContentListPage},
    ContentDetail: {screen: ContentDetailPage}
});

AppRegistry.registerComponent('RnApp', () => RnApp);
