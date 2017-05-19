import _ from 'lodash';
import React from 'react';
import {StyleSheet, View, Text, Button, FlatList, TextInput, ToastAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Utils from '../utils';
import settings from '../settings';
import Constants from '../Constants';

class CommentPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            title: `${navigation.state.params.commentsNumber}条评论`
        };
    };
    constructor (props) {
        super(props);
        const {section, user} = props.navigation.state.params;
        this.section = section;
        this.user = user;
        this.state = {
            comments: [],
            commentContent: '',
            parentUsername: null,
            hasLiked: []
        };
        // 用户事件 create_comment
        this._handleSend = this._handleSend.after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.create_comment
        }));

    }
    componentDidMount () {
        const {host, port} = settings.server;
        const commentApi = `http://${host}:${port}/api/comments?section_id=${this.section._id}`;
        Utils.get(commentApi, (res) => {
            // 设置header中的commentsNumber
            this.props.navigation.setParams({commentsNumber: res.length});
            // 保存commentsNumber到this对象
            this.commentsNumber = res.length;
            // 收集已经点过赞的评论
            let hasLiked = [];
            _.forEach(res, (item) => {
               if (item.be_liked.indexOf(this.user._id) !== -1) {
                    hasLiked.push(item._id);
               }
            });
            this.setState({
                comments: _.reverse(res),
                hasLiked
            });
        }, (err) => {
            alert(err.message);
        });
    }
    _genLikeIcon () {
        return <Icon name="thumbs-o-up"/>;
    }
    _genCommentItem (item) {
        const d = new Date(item.post_time);
        const postTimeString = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        const likesNumber = item.be_liked.length;
        return (
            <View style={styles.commentItem}>
                <View style={styles.top}>
                    <Text>
                        <Text style={styles.username}>{item.username}</Text>
                        {item.parent_username &&
                        <Text>
                            <Text> 回复 </Text>
                            <Text style={styles.username}>{item.parent_username}</Text>
                        </Text>
                        }
                    </Text>
                    <Text style={styles.postTime}>{postTimeString}</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.content}>{item.content}</Text>
                </View>
                <View style={styles.bottom}>
                    <Text style={[styles.like, this.state.hasLiked.indexOf(item._id) === -1 ? null : styles.hasLiked]} onPress={this._handleLike.bind(this, item)}>
                        {this._genLikeIcon()}
                        {likesNumber > 0 ?
                            <Text>  {likesNumber + ''}</Text> :
                            <Text>  赞</Text>
                        }
                    </Text>
                    <Text onPress={this._handleReply.bind(this, item)}>回复</Text>
                </View>
            </View>
        );
    }
    // 点击发送评论
    _handleSend () {
        const {host, port} = settings.server;
        const commentApi = `http://${host}:${port}/api/comments`;
        let commentObj = {
            section_id: this.section._id,
            username: this.user.username,
            content: this.state.commentContent
        };
        // 如果有父评论
        if (this.state.parentUsername) {
           commentObj.parent_username = this.state.parentUsername;
        }
        Utils.post(commentApi, commentObj, (res) => {
            const newComments = _.cloneDeep(this.state.comments);
            newComments.unshift(res);
            this.setState((prevState) => ({
                comments: newComments,
                commentContent: ''
            }));
            // 设置header中的commentsNumber
            this.props.navigation.setParams({commentsNumber: ++ this.commentsNumber});
            this._textInput.blur();
            this._flatList.scrollToOffset(0);
            ToastAndroid.show('评论成功!', ToastAndroid.SHORT);
        }, (error) => {
            alert(error.message);
            this._textInput.blur();
            ToastAndroid.show('评论失败!', ToastAndroid.SHORT);
        });
    }
    // 点击回复
    _handleReply (item) {
        this._textInput.focus();
        this.setState({
            commentContent: '',
            parentUsername: item.username
        });
    }
    // TextInput的blur
    _handleBlur () {
        this.setState({
            parentUsername: null
        });
    }
    // 点击赞
    _handleLike (item) {
        const {host, port} = settings.server;
        const commentLikeApi = `http://${host}:${port}/api/comments/${item._id}/likes`;
        if (item.be_liked.indexOf(this.user._id) === -1) {
            Utils.post(commentLikeApi, {
                user_id: this.user._id
            }, (res) => {
                const newComments = _.cloneDeep(this.state.comments);
                _.forEach(newComments, (c) => {
                    if (c._id === res._id) {
                        c.be_liked.push(this.user._id);
                        return false;
                    }
                });
                const newHasLiked = _.cloneDeep(this.state.hasLiked);
                newHasLiked.push(item._id);
                this.setState({
                    comments: newComments,
                    hasLiked: newHasLiked
                });
            }, (err) => {
                alert(err.message);
            });
        } else {
            Utils.delete(commentLikeApi, {
                user_id: this.user._id
            }, (res) => {
                const newComments = _.cloneDeep(this.state.comments);
                _.forEach(newComments, (c) => {
                    if (c._id === res._id) {
                        _.pull(c.be_liked, this.user._id)
                        return false;
                    }
                });
                const newHasLiked = _.cloneDeep(this.state.hasLiked);
                _.pull(newHasLiked, item._id);
                this.setState({
                    comments: newComments,
                    hasLiked: newHasLiked
                });
            });
        }
    }
    render () {
        return (
            <View style={styles.container}>
                <FlatList
                    ref={ref => this._flatList = ref}
                    data={this.state.comments}
                    renderItem={({item}) => this._genCommentItem(item)}
                    keyExtractor={item => item._id}
                    ItemSeparatorComponent={() => <View style={styles.line}></View>}
                />
                <View style={styles.sendBox}>
                    <TextInput
                        ref={ref => this._textInput = ref}
                        style={styles.input}
                        onChangeText={(commentContent) => this.setState({commentContent})}
                        value={this.state.commentContent}
                        underlineColorAndroid={'transparent'}
                        placeholder={this.state.parentUsername ? `回复${this.state.parentUsername}:` : `评论`}
                        onBlur={this._handleBlur.bind(this)}
                    />
                    <View style={styles.send}>
                        <Button
                            title="评论"
                            onPress={() => this._handleSend(this.state.commentContent)}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: '#D7D7D7'
    },
    commentItem: {
        padding: 10
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    center: {
        marginVertical: 10
    },
    bottom: {
        flexDirection: 'row'
    },
    username: {
        color: '#555B81',
        fontSize: 18
    },
    content: {
        color: '#333',
        fontSize: 16
    },
    postTime: {
        alignSelf: 'flex-end'
    },
    like: {
        marginRight: 30
    },
    sendBox: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        marginVertical: 10,
        marginHorizontal: 5
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 5,
        flex: 1
    },
    send: {
        width: 70,
        justifyContent: 'center',
        marginLeft: 5
    },
    hasLiked: {
        color: 'green'
    }
});
export default CommentPage;