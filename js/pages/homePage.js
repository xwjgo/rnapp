import React from 'react';
import {AppRegistry, StyleSheet, View, Text, Button} from 'react-native';
import Header from '../components/header';
import Item from '../components/item';

class HomePage extends React.Component {
    static navigationOptions = {
        headerVisible: false
    };

    render () {
        const {navigate} = this.props.navigation;
        return (
            <View>
                <Text>Homepage</Text>
                <Header/>
                <Button
                    onPress={() => navigate('ContentList', {user: 'xwj'})}
                    title="导航到contentList"
                />
                <Button
                    onPress={() => navigate('ContentDetail', {user: 'hyy'})}
                    title="导航到contentDetail"
                />
            </View>
        );
    }
}

export default HomePage;