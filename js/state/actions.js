const ACTIONS = {
    ADD_SOCKET_DATA: 'ADD_SOCKET_DATA',
    UPDATE_NUMBER: 'UPDATE_NUMBER'
};

const addSocketData = (roomId, socketData) => ({
    type: 'ADD_SOCKET_DATA',
    socketData,
    roomId
});

const updateNumber = (roomId, number) => ({
    type: 'UPDATE_NUMBER',
    number,
    roomId
});

export {
    ACTIONS,
    addSocketData,
    updateNumber
};
