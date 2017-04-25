import React from 'react';
import {AppRegistry, StyleSheet, Text, View, ScrollView, FlatList} from 'react-native';

class Header extends React.Component {
    render () {
        return (
            <ScrollView>
                <FlatList
                    data={[{key: 'a'}, {key: 'b'}]}
                    renderItem={({item}) => <Text>{item.key}</Text>}
                />
            </ScrollView>
        );
    }
}

export default Header;