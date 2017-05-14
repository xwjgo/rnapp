import _ from 'lodash';
import React from 'react';
import {StyleSheet, Text, View, AsyncStorage, ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Utils from '../utils';
import settings from '../settings';

class Bottom extends React.Component {
    constructor (props) {
        super(props);
        this.section = props.section;
        this.state = {
            hasLiked: false
        }
    }
    // 收藏按钮
    _genLikeButton () {
        return (this.state.hasLiked ?
            <Icon style={styles.icon} name="heart" size={25} color="#2196F3" onPress={this._handleLike.bind(this)}/> :
            <Icon style={styles.icon} name="heart-o" size={25} color="#2196F3" onPress={this._handleLike.bind(this)}/>
        );
    }
    // 评论按钮
    _genCommentButton () {
        return <Icon style={[styles.icon, styles.comment]} name="comment-o" size={25} color="#2196F3"/>
    }
    // 评分按钮
    _genScoreButton () {
        return <Icon style={styles.icon} name="star-o" size={25} color="#2196F3"/>
    }
    // 点击收藏
    _handleLike () {
        const {host, port} = settings.server;
        const likeApi = `http://${host}:${port}/api/users/${this.user._id}/likes`;
        if (this.state.hasLiked) {
            Utils.delete(likeApi, {
                section_id: this.section._id
            }, () => {
                ToastAndroid.show('取消收藏该小节成功!', ToastAndroid.SHORT, ToastAndroid.CENTER);
                this._setStateAndUpdateStorage();
            }, () => {
                ToastAndroid.show('取消收藏该小节失败!', ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        } else {
            Utils.post(likeApi, {
                section_id: this.section._id
            }, (res) => {
                ToastAndroid.show('收藏该小节成功!', ToastAndroid.SHORT, ToastAndroid.CENTER);
                this._setStateAndUpdateStorage();
            }, (res) => {
                ToastAndroid.show('收藏该小节失败!', ToastAndroid.SHORT, ToastAndroid.CENTER);
            });
        }
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
        });
    }
    render () {
        return (
            <View style={styles.bottomBox}>
                {this._genScoreButton()}
                {this._genLikeButton()}
                {this._genCommentButton()}
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
    }
});

export default Bottom;