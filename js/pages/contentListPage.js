import _ from 'lodash';
import React from 'react';
import {View, Text, FlatList} from 'react-native';
import CourseItem from '../components/courseItem';
import Utils from '../utils';
import settings from '../settings';

class ContentListPage extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            courses: null
        };
    }
    _fetchCourses () {
        const categories = this.props.screenProps.categories;
        const category_name = this.props.navigation.state.routeName;
        let category_id;
        _.forEach(categories, (item) => {
            if (item.category_name === category_name) {
                category_id = item._id;
                return false;
            }
        });
        const {host, port} = settings.server;
        const getCourseApi = `http://${host}:${port}/api/categories/${category_id}/courses`;
        Utils.get(getCourseApi, (res) => {
            this.setState({
                courses: res
            });
        }, (err) => {
            alert(err.message);
        });
    }
    componentDidMount () {
        this._fetchCourses();
    }
    render () {
        const courses = this.state.courses;
        return (courses &&
            <View>
                <FlatList
                    data={courses}
                    renderItem={({item}) => <CourseItem course={item}/>}
                    keyExtractor={item => item._id}
                />
            </View>
        );
    }
}

export default ContentListPage;
