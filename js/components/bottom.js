import _ from 'lodash';
import React from 'react';
import {connect} from 'react-redux';
import {NavigationActions} from 'react-navigation';
import {StyleSheet, Text, View, AsyncStorage, ToastAndroid, FlatList, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Utils from '../utils';
import settings from '../settings';

class Bottom extends React.Component {
    constructor (props) {
        super(props);
        this.section = props.section;
        this.state = {
            hasLiked: false,
            hasScore: false,
            score: null,
            isScoreSelectVisible: false
        }
    }
    // 收藏按钮
    _genLikeButton () {
        return (this.state.hasLiked ?
            <Icon style={styles.icon} name="heart" size={25} color="#2196F3"/> :
            <Icon style={styles.icon} name="heart-o" size={25} color="#2196F3"/>
        );
    }
    // 评论按钮
    _genCommentButton () {
        return <Icon style={[styles.icon, styles.comment]} name="comment-o" size={25} color="#2196F3"/>;
    }
    // 评分按钮
    _genScoreButton () {
        return (this.state.hasScore ?
            <Icon style={styles.icon} name="thumbs-up" size={25} color="#2196F3"/> :
            <Icon style={styles.icon} name="thumbs-o-up" size={25} color="#2196F3"/>
        );
    }
    // 评分选择框
    _genScoreSelect () {
        const scores = [{key: 1}, {key: 2}, {key: 3}, {key: 4}, {key: 5}];
        return (
            <FlatList
                data={scores}
                renderItem={({item}) => (
                    <TouchableOpacity onPress={this._handleSelectScore.bind(this, item.key)}>
                        <Text style={styles.scoreText}>
                            {item.key}分
                            {this.state.score === item.key && <Text style={styles.tick}>  ✔</Text>}
                        </Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (<View style={styles.line}></View>)}
            />
        );
    }
    // 点击收藏
    _handleLike () {
        const {host, port} = settings.server;
        const likeApi = `http://${host}:${port}/api/users/${this.user._id}/likes`;
        if (this.state.hasLiked) {
            Utils.delete(likeApi, {
                section_id: this.section._id
            }, () => {
                ToastAndroid.show('取消收藏该小节成功!', ToastAndroid.SHORT);
                this._setStateAndUpdateStorage();
            }, () => {
                ToastAndroid.show('取消收藏该小节失败!', ToastAndroid.SHORT);
            });
        } else {
            Utils.post(likeApi, {
                section_id: this.section._id
            }, (res) => {
                ToastAndroid.show('收藏该小节成功!', ToastAndroid.SHORT);
                this._setStateAndUpdateStorage();
            }, (res) => {
                ToastAndroid.show('收藏该小节失败!', ToastAndroid.SHORT);
            });
        }
    }
    // 点击评分
    _handleScore () {
        this.setState((prevState) => ({
            isScoreSelectVisible: !prevState.isScoreSelectVisible
        }));
    }
    // 选择某个评分
    _handleSelectScore (score) {
        // 提交分数
        const {host, port} = settings.server;
        const addScoreApi = `http://${host}:${port}/api/scores`;
        const updateScoreApi = `${addScoreApi}?section_id=${this.section._id}&user_id=${this.user._id}`;
        if (this.state.hasScore) {
            Utils.put(updateScoreApi, {score}, this._changeScoreSuccess.bind(this, score), this._changeScoreError);
        } else {
            Utils.post(addScoreApi, {
                user_id: this.user._id,
                section_id: this.section._id,
                score
            }, this._changeScoreSuccess.bind(this, score), this._changeScoreError);
        }
    }
    // 点击评论
    _handleComment () {
        const navigationAction = NavigationActions.navigate({
            routeName: 'Comment',
            params: {
                section: this.section,
                user: this.user,
                commentNumber: 0
            }
        });
        this.props.dispatch(navigationAction);
    }
    _changeScoreSuccess (score) {
        ToastAndroid.show('分数提交成功!', ToastAndroid.SHORT);
        this.setState((prevState) => ({
            isScoreSelectVisible: !prevState.isScoreSelectVisible,
            hasScore: true,
            score
        }));
    }
    _changeScoreError () {
        ToastAndroid.show('分数提交失败!', ToastAndroid.SHORT);
        this.setState((prevState) => ({
            isScoreSelectVisible: !prevState.isScoreSelectVisible
        }));
    }
    _setStateAndUpdateStorage () {
        // 更新AsyncStorage
        if (this.state.hasLiked) {
            _.pull(this.user.likes, this.section._id);
        } else {
            this.user.likes.push(this.section._id);
        }
        AsyncStorage.setItem('user',  JSON.stringify(this.user));
        // 更新state
        this.setState((prevState) => ({
            hasLiked: !prevState.hasLiked
        }));
    }
    componentDidMount () {
        // 获取like信息
        AsyncStorage.getItem('user', (error, result) => {
            if (error) {
                return;
            }
            this.user = JSON.parse(result);
            if (this.user.likes.indexOf(this.section._id) !== -1) {
                this.setState({
                    hasLiked: true
                });
            }
        }).then(() => {
            // 获取score信息
            const {host, port} = settings.server;
            const scoreApi = `http://${host}:${port}/api/scores?section_id=${this.section._id}&user_id=${this.user._id}`;
            Utils.get(scoreApi, (res) => {
                if (res[0]) {
                    this.setState({
                        hasScore: true,
                        score: res[0].score
                    });
                }
            }, (err) => {
                alert(err.message);
            });
        });
    }
    render () {
        return (
            <View>
                {this.state.isScoreSelectVisible ?
                    <View style={styles.scoreSelect}>
                        {this._genScoreSelect()}
                    </View> :
                    null
                }
                <View style={styles.bottomBox}>
                    <TouchableOpacity onPress={this._handleScore.bind(this)}>
                        {this._genScoreButton()}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._handleLike.bind(this)}>
                        {this._genLikeButton()}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._handleComment.bind(this)}>
                        {this._genCommentButton()}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bottomBox: {
        height: 50,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#D7D7D7',
        flexDirection: 'row',
        alignItems: 'center'
    },
    icon: {
        marginHorizontal: 15
    },
    comment: {
        marginBottom: 3
    },
    scoreSelect: {
        width: 150,
        borderWidth: 1,
        borderColor: '#D7D7D7',
        borderRadius: 5,
        position: 'absolute',
        bottom: 50,
        left: 0,
        backgroundColor: '#fff'
    },
    scoreText: {
        color: '#2196F3',
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 3,
    },
    line: {
        height: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7'
    },
    tick: {
        color: '#9FE658'
    }
});

export default connect()(Bottom);