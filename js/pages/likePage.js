import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StyleSheet, View, Text, FlatList, AsyncStorage, TouchableOpacity} from 'react-native';
import async from 'async';
import Utils from '../utils';
import settings from '../settings';

class LikePage extends React.Component {
    static navigationOptions = {
        tabBarLabel: (o) => (
            <Icon name="heart" size={25}/>
        )
    };
    constructor (props) {
        super(props);
        this.state = {
            likes: []
        };
    }
    componentDidMount () {
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return;
            }
            if (!result) {
                return;
            }
            this.user = JSON.parse(result);
            let likes = [];
            // 请求小节内容
            const {host, port} = settings.server;
            async.each(this.user.likes, (like, callback) => {
                const courseApi = `http://${host}:${port}/api/courses?chapters.sections._id=${like}`;
                Utils.get(courseApi, (res) => {
                    const {course_name, chapters} = res[0];
                    _.forEach(chapters, (c) => {
                        const {sections} = c;
                        _.forEach(sections, (s) => {
                            if (s._id === like) {
                                likes.push({
                                    course_name,
                                    chapter_title: c.title,
                                    section_title: s.title,
                                    sectionObj: s
                                });
                            }
                        });
                    });
                    return callback();
                }, (err) => {
                    return callback(err);
                });
            }, (err) => {
                if (err) {
                    return alert(err.message);
                }
                // 更新state
                this.setState({
                    likes
                });
            });
        });
    }
    _goSectionPage (item) {
        const navigationAction = NavigationActions.navigate({
            routeName: 'ContentDetail',
            params: {section: item.sectionObj}
        });
        this.props.dispatch(navigationAction);
    }
    _genLikeItem (item) {
        return (
            <TouchableOpacity style={styles.sectionBox} onPress={this._goSectionPage.bind(this, item)}>
                <View style={styles.top}>
                    <Text style={styles.courseName}>{item.course_name}</Text>
                    <Text>{item.chapter_title}</Text>
                </View>
                <Text style={styles.bottom}>{item.section_title}</Text>
            </TouchableOpacity>
        );
    }
    render () {
        const likesLength = this.state.likes.length;
        return (likesLength > 0 &&
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>共有 {likesLength} 篇收藏</Text>
                </View>
                <View>
                    <FlatList
                        data={this.state.likes}
                        renderItem={({item}) => this._genLikeItem(item)}
                        keyExtractor={item => _.uniqueId()}
                        ItemSeparatorComponent={() => <View style={styles.line}></View>}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        marginBottom: 10
    },
    title: {
        fontSize: 18,
        paddingLeft: 10,
        color: '#fff'
    },
    sectionBox: {
        padding: 10,
        backgroundColor: '#fff'
    },
    top: {
        flexDirection: 'row'
    },
    courseName: {
        paddingRight: 30
    },
    bottom: {
        color: '#333',
        fontSize: 16,
        marginTop: 10
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7'
    }
});

export default connect()(LikePage);