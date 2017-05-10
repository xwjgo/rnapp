import io from 'socket.io-client';

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
                successCallback(res);
            } else {
                errorCallback(res);
            }
        }).catch(err => {
            alert('请求失败');
        });
    };

    /**
     * 对fetch中get请求的封装
     * @param url
     * @param successCallback
     * @param errorCallback
     */
    static get (url, successCallback, errorCallback) {
       fetch(url).then(res => res.json()).then(res => {
           if (!res.code) {
               successCallback(res);
           } else {
               errorCallback(res);
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
}
