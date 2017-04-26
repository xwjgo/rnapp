import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

class ChapterListPage extends React.Component {
    render () {
        return (
            <View>
                <Text>chapterList</Text>
                <Text>{this.props.course}</Text>
            </View>
        );
    }
}

export default ChapterListPage;