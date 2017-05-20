import React from 'react';
import {StyleSheet, View, Text, WebView, ScrollView, ToastAndroid, Dimensions, StatusBar, Button, AsyncStorage} from 'react-native';
import Orientation from 'react-native-orientation';
import Bottom from '../components/bottom';
import settings from '../settings';
import Utils from '../utils';
import Constants from '../Constants';

class ContentDetailPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isFullScreen: false
        };
        // 用户事件 play_video
        this._playVideo = new Function().after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.play_video
        }));
        // 用户事件 pause_video
        this._pauseVideo = new Function().after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.pause_video
        }));
        // 用户事件 leave_section
        this.componentWillUnmount = new Function().after(Utils.pushEvent.bind(this, {
            event_name: Constants.Events.leave_section
        }))
    }
    static navigationOptions ({navigation}) {
        const {section, isFullScreen} = navigation.state.params;
        if (isFullScreen) {
            return {
                header: null
            }
        }
        return {
            title: section.title,
            headerRight: (<Button
                title="聊天室"
                onPress={() => {
                    navigation.navigate('Chat', {section: section});
                }}
            />),
            headerStyle: {paddingRight: 10}
        }
    }
    _handlePostMessage (e) {
        const message = e.nativeEvent.data;
        switch (message) {
            case 'toggleFullScreen':
                if (this.state.isFullScreen) {
                    Orientation.lockToPortrait();
                    // 显示导航
                    this.props.navigation.setParams({isFullScreen: false});
                } else {
                    // 进入全屏后
                    Orientation.lockToLandscape();
                    // 隐藏导航
                    this.props.navigation.setParams({isFullScreen: true});
                }
                this.setState((prevState) => ({
                    isFullScreen: !prevState.isFullScreen
                }));
                break;
            case 'playVideo':
                this._playVideo();
                break;
            case 'pauseVideo':
                this._pauseVideo();
        }
    };
    _genVideoHtml () {
        const {video} = this.props.navigation.state.params.section;
        const {host, port} = settings.server;
        const videoUrl = `http://${host}:${port}/${video}`;
        return `
            <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto">
                <source src="${videoUrl}" type='video/mp4'>
                <p class="vjs-no-js">
                    不支持HTML5视频播放
                    <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p>
            </video>
        `;
    }
    _genTemplate (videoHtml, width, height) {
        const {html, video} = this.props.navigation.state.params.section;
        return `
            <head>
                <link href="http://vjs.zencdn.net/6.0.0/video-js.css" rel="stylesheet">
                <style>
                  * {
                    word-wrap: break-word;
                    box-sizing: border-box;
                  }
                  body {
                    margin: 0;
                    padding: 0
                  }
                  #main {
                    width: 100%;
                    overflow: hidden;
                    padding: 0 5px
                  } 
                  .little-video{
                    width: 100%;
                    height: 250px
                  }
                  .big-video {
                    width: 100%;
                    height: ${width};
                  }
                  .display-none {
                    display: none;
                  }
                </style>
            </head>
            <body>
              <div id="video"></div>
              <div id="main">
                ${html}
              </div>
              <script src="http://vjs.zencdn.net/6.0.0/video.js"></script>
              <script type="text/javascript">
                const videoWrapper = document.querySelector('#video');
                if('${video}' !== 'undefined') {
                    videoWrapper.innerHTML = \`${videoHtml}\`;
                    const myPlayer = videojs('my-video');
                    const fsToggle = myPlayer.getChild('ControlBar').getChild('FullscreenToggle').contentEl();
                    const video = document.querySelector('#my-video');
                    const main = document.querySelector('#main');
                    video.classList.add('little-video');
                    fsToggle.addEventListener('click', () => {
                        window.postMessage('toggleFullScreen');
                        if (video.classList.contains('big-video')) {
                            video.classList.remove('big-video');
                            video.classList.add('little-video');
                            main.classList.remove('display-none');
                        } else {
                            video.classList.remove('little-video');
                            video.classList.add('big-video');
                            main.classList.add('display-none');
                        }
                    });
                    myPlayer.on('play', () => {
                        window.postMessage('playVideo');
                    });
                    myPlayer.on('pause',() => {
                        window.postMessage('pauseVideo'); 
                    });
                }
              </script>
            </body>
        `;
    }
    render () {
        const {width, height} = Dimensions.get('window');
        const {section} = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={this.state.isFullScreen}
                />
                <WebView
                    source={{html: this._genTemplate(this._genVideoHtml(), width, height)}}
                    onMessage={(e) => {this._handlePostMessage(e)}}
                />
                {this.state.isFullScreen ? null : <Bottom section={section}/>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default ContentDetailPage;
