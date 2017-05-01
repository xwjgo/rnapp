import React from 'react';
import {StyleSheet, View, Text, WebView, ScrollView} from 'react-native';
import Video from 'react-native-video';
import settings from '../settings';

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
        return (
            <ScrollView style={styles.container}>
                <Video
                    source={{uri: videoUrl}}
                    style={styles.video}
                    controls={true}
                    resizeMode="contain"
                    playInBackground={false}
                    playWhenInactive={false}
                />
                <WebView
                    source={{html}}
                    style={styles.webView}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    video: {
        height: 200
    },
    webView: {
        height: 1000
    }
});

export default ContentDetailPage;
