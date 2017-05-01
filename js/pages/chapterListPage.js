import _ from 'lodash';
import React from 'react';
import {View, Text, StyleSheet, SectionList, TouchableOpacity, TouchableHighlight} from 'react-native';

class ChapterListPage extends React.Component {
    static navigationOptions ({navigation}) {
        const {course_name} = navigation.state.params.course;
        return {
            title: course_name
        }
    }
    constructor (props) {
        super(props);
        const course = this.props.navigation.state.params.course;
        this.state = {
            currentChapterId: _.get(course, 'chapters[0]._id', '')
        };
    }
    _handlePress (section) {
        this.setState({
            currentChapterId: section.key
        });
    }
    _goContentDetailPage (section) {
        const {navigate} = this.props.navigation;
        navigate('ContentDetail', {section: section});
    }
    _genHeader (section) {
        return (
            <TouchableHighlight onPress={() => this._handlePress(section)}>
                <View style={styles.commonItem}>
                    <Text style={styles.headerText}>🌴 {section.title}</Text>
                </View>
            </TouchableHighlight>
        );
    }
    _genItem (item) {
        return ( item.c_id === this.state.currentChapterId &&
            <TouchableOpacity onPress={() => {this._goContentDetailPage(item)}}>
                <View style={styles.commonItem}>
                    <Text>    🍁 {item.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    render () {
        const chapters = this.props.navigation.state.params.course.chapters;
        let data = [];
        _.forEach(chapters, (item) => {
            data.push({
                data: item.sections.map((s) => _.extend(s, {key: s._id, c_id: item._id})),
                title: item.title,
                key: item._id
            });
        });
        return (
            <View style={styles.container}>
                <SectionList
                    sections={data}
                    renderSectionHeader={({section}) => this._genHeader(section)}
                    renderItem={({item}) => this._genItem(item)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginVertical: 5,
        padding: 10
    },
    headerText: {
        color: '#000',
        fontSize: 16
    },
    itemText: {
        fontSize: 14
    },
    commonItem: {
        height: 50,
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#D7D7D7'
    }
});

export default ChapterListPage;