import _ from 'lodash';
import {ACTIONS} from './actions';

const socketData = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS.ADD_SOCKET_DATA:
            let newState = _.cloneDeep(state);
            newState[action.roomId] || (newState[action.roomId] = []);
            newState[action.roomId].push(action.socketData);
            return newState;
        default:
            return state;
    }
};

const number = (state = {}, action) => {
    switch (action.type) {
        case ACTIONS.UPDATE_NUMBER:
            let newState = _.cloneDeep(state);
            newState[action.roomId] || (newState[action.roomId] = 0);
            newState[action.roomId] = action.number;
            return newState;
        default:
            return state;
    }
};

export {
    socketData,
    number
};
