import React from 'react';
import {StyleSheet, View, Text, WebView, ScrollView, ToastAndroid, Dimensions, StatusBar} from 'react-native';
import Orientation from 'react-native-orientation';
import settings from '../settings';

class ContentDetailPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isFullScreen: false
        };
    }
    static navigationOptions ({navigation}) {
        return {
            title: navigation.state.params.section.title,
            headerVisible: !navigation.state.params.isFullScreen
        }
    }
    handleFsToggle () {
        if (this.state.isFullScreen) {
            Orientation.lockToPortrait();
        } else {
            // 进入全屏后
            Orientation.lockToLandscape();
            // 隐藏导航
            this.props.navigation.setParams({isFullScreen: true});
            // 禁止WebView滚动


        }
        this.setState((prevState) => ({
            isFullScreen: !prevState.isFullScreen
        }));
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
                }
              </script>
            </body>
        `;
    }
    render () {
        const {width, height} = Dimensions.get('window');
        return (
            <View style={styles.container}>
                <StatusBar
                    hidden={this.state.isFullScreen}
                />
                <WebView
                    source={{html: this._genTemplate(this._genVideoHtml(), width, height)}}
                    onMessage={this.handleFsToggle.bind(this)}
                />
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
