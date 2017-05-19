import _ from 'lodash';
import io from 'socket.io-client';
import settings from '../settings';
import {AsyncStorage} from 'react-native';

export default class Utils {
    /**
     * 对fetch中post请求的封装
     * @param url
     * @param data
     * @param successCallback
     * @param errorCallback
     */
    static post (url, data, successCallback, errorCallback) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            if (!res.code) {
                successCallback && successCallback(res);
            } else {
                errorCallback && errorCallback(res);
            }
        }).catch(err => {
            alert('请求失败');
        });
    };

    /**
     * 对fetch的delete请求封装
     * @param url
     * @param data
     * @param successCallback
     * @param errorCallback
     */
    static delete (url, data, successCallback, errorCallback) {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            if (!res.code) {
                successCallback && successCallback(res);
            } else {
                errorCallback && errorCallback(res);
            }
        }).catch(err => {
            alert('请求失败');
        });
    }

    static put (url, data, successCallback, errorCallback) {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            if (!res.code) {
                successCallback && successCallback(res);
            } else {
                errorCallback && errorCallback(res);
            }
        }).catch(err => {
            alert('请求失败');
        });
    }

    /**
     * 对fetch中get请求的封装
     * @param url
     * @param successCallback
     * @param errorCallback
     */
    static get (url, successCallback, errorCallback) {
       fetch(url).then(res => res.json()).then(res => {
           if (!res.code) {
               successCallback && successCallback(res);
           } else {
               errorCallback && errorCallback(res);
           }
       }).catch(err => {
           alert('请求失败');
       });
    }

    /**
     * 获取socket单例
     * @param server
     * @returns {*}
     */
    static getSocket (server) {
        this.sockets || (this.sockets = {});
        if (!this.sockets[server]) {
            return {
                socket: this.sockets[server] = io(server, {jsonp: false}),
                isNewSocket: true
            };
        }
        return {
            socket: this.sockets[server],
            isNewSocket: false
        };
    }

    /**
     * 埋点方法
     * @param eventObj
     */
    static pushEvent (eventObj) {
        const {host, port} = settings.server;
        const eventApi = `http://${host}:${port}/api/events`;
        AsyncStorage.getItem('user', (err, result) => {
           if (err || !result) {
               return;
           }
           const user = JSON.parse(result);
           Utils.post(eventApi, _.extend(eventObj, {username: user.username}));
        });
    }


}
