import React from 'react';
import {StyleSheet, View, Text, WebView, ScrollView, ToastAndroid, Dimensions} from 'react-native';
import settings from '../settings';

const {width, height} = Dimensions.get('window');

class ContentDetailPage extends React.Component {
    static navigationOptions ({navigation}) {
        return {
            title: navigation.state.params.section.title
        }
    }
    render () {
        const {video, html} = this.props.navigation.state.params.section;
        const {host, port} = settings.server;
        const videoUrl = `http://${host}:${port}/${video}`;
        const htmlWithVideo= `
            <head>
                <link href="http://vjs.zencdn.net/5.19.2/video-js.css" rel="stylesheet">
                <style>
                  * {
                    word-wrap: break-word;
                  }
                  body {
                    margin: 0;
                    padding: 0
                  }
                  #main {
                    width: ${width};
                    overflow: hidden;
                  } 
                </style>
            </head>
            <body>
              <video id="my-video" class="video-js vjs-big-play-centered" controls preload="auto" width="${width}" height="264" data-setup="{}">
                <source src="${videoUrl}" type='video/mp4'>
                <p class="vjs-no-js">
                  不支持HTML5视频播放
                  <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
                </p>
              </video>
              <div id="main">
                ${html}
              </div>
              <script src="http://vjs.zencdn.net/5.19.2/video.js"></script>
              <script type="text/javascript">
                const video = document.querySelector('video');
                  if (!${video}) {
                    video.parentNode.removeChild(video);  
                  }
              </script>
            </body>
        `;
        return (
            <WebView
                source={{html: htmlWithVideo}}
                style={styles.webView}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    webView: {
    }
});

export default ContentDetailPage;
