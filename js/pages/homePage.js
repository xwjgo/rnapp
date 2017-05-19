import _ from 'lodash';
import React from 'react';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TabNavigator} from 'react-navigation';
import contentListPage from './contentListPage';
import settings from '../settings';
import Utils from '../utils';

class HomePage extends React.Component {
    static navigationOptions = {
        header: null,
        tabBarLabel: (o) => (
            <Icon name="home" size={25}/>
        )
    };
    constructor (props) {
        super(props);
        this.state = {
            categories: null
        }
    }
    _fetchCategories () {
        const {host, port} = settings.server;
        const getCategoryApi = `http://${host}:${port}/api/categories`;
        Utils.get(getCategoryApi, (res) => {
            this.setState({
                categories: res
            });
        }, (err) => {
            alert(err.message);
        });
    }
    _genTab () {
        const categories = this.state.categories;
        if (!categories) {
            return;
        }
        let tabMap = {};
        _.forEach(categories, (item) => {
            tabMap[item.category_name] = {screen: contentListPage};
        });
        const Tab = TabNavigator(tabMap, {
            tabBarOptions: {
                upperCaseLabel: false,
                scrollEnabled: true,
                tabStyle: {
                    width: 100
                }
            },
            // 开启懒加载
            lazyLoad: true
        });
        return <Tab
            screenProps={{categories: categories}}
        />;
    }
    componentDidMount () {
        this._fetchCategories();
    }
    render () {
        const hasCategories = this.state.categories;
        return (hasCategories && this._genTab());
    }
}

export default HomePage;