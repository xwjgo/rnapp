import React from 'react';
import {AppRegistry, StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import settings from '../settings';

class CourseItem extends React.Component {
    render () {
        const course = this.props.course;
        const {course_name, teacher, post_time, picture} = course;
        const post_date = new Date(post_time);
        const {host, port} = settings.server;
        return (
            <TouchableOpacity>
                <View style={styles.container}>
                    <View style={styles.left}>
                        <View>
                            <Text style={styles.title}>{course_name}</Text>
                        </View>
                        <View style={styles.crumbs}>
                            <Text>{teacher}</Text>
                            <Text style={styles.time}>{`${post_date.getFullYear()}-${post_date.getMonth() + 1}-${post_date.getDate()}`}</Text>
                        </View>
                    </View>
                    <View>
                        <Image source={{uri: `http://${host}:${port}/${picture}`}} style={styles.image}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 5,
        height: 100,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10
    },
    left: {
        height: 80,
        justifyContent: 'space-around',
    },
    title: {
        fontSize: 16,
        color: '#000',
    },
    crumbs: {
        flexDirection: 'row'
    },
    time: {
        marginHorizontal: 10
    },
    image: {
        height: 80,
        width: 80
    }
});

export default CourseItem;