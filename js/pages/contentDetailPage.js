import React from 'react';
import {StyleSheet, View, Text, WebView, ScrollView, ToastAndroid, Dimensions} from 'react-native';
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
            title: navigation.state.params.section.title
        }
    }
    handleFsToggle () {
        Orientation.lockToLandscape();
        // this.setState((prevState) => ({
        //     isFullScreen: !prevState.isFullScreen
        // }));
    };
    render () {
        const {width} = Dimensions.get('window');
        const {video, html} = this.props.navigation.state.params.section;
        const {host, port} = settings.server;
        const videoUrl = `http://${host}:${port}/${video}`;
        const videoHtml = `
            <video id="my-video" class="video-js vjs-big-play-centered vjs-tech" width=${width} controls preload="auto">
                <source src="${videoUrl}" type='video/mp4'>
                <p class="vjs-no-js">
                    不支持HTML5视频播放
                    <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p>
            </video>
        `;
        const templateHtml= `
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
                </style>
            </head>
            <body>
              <div id="video"></div>
              <div id="main">
                ${html}
              </div>
              <script src="http://vjs.zencdn.net/6.0.0/video.js"></script>
              <script type="text/javascript">
                const videoNode = document.querySelector('#video');
                if('${video}' !== 'undefined') {
                    videoNode.innerHTML = \`${videoHtml}\`;
                    const myPlayer = videojs('my-video');
                    const controlBar = myPlayer.getChild('ControlBar');
                    const fsToggle = controlBar.getChild('FullscreenToggle').contentEl();
                    fsToggle.addEventListener('click', () => {
                        window.postMessage('toggleFullScreen');
                    });
                }
              </script>
            </body>
        `;
        return ( this.state.isFullScreen ?
            <WebView
                source={{html: templateHtml}}
                style={[styles.webView, styles.fullScreen]}
                onMessage={this.handleFsToggle.bind(this)}
            />
            :
            <WebView
                source={{html: templateHtml}}
                style={styles.webView}
                onMessage={this.handleFsToggle.bind(this)}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webView: {

    },
    fullScreen: {
        transform: [{rotate: '90deg'}],
    }
});

export default ContentDetailPage;
