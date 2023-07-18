import axios from 'axios';

export const getUsers = async (users) => {
    try {
        const res = await axios.post("https://fylo-app-server.herokuapp.com/user/getMany", {
            users: users
        });

        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const getAllUsers = async () => {
    try {
        const res = await axios.post("https://fylo-app-server.herokuapp.com/user/list");

        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const searchUsers = async (query) => {
    try {
        const res = await axios.post("https://fylo-app-server.herokuapp.com/user/search", {
            query: query
        });

        return res.data;
    } catch (error) {
        console.log(error.response.data);
    }
}

export const sendFriendRequest = async (userId, friendId) => {
    try {
        const sendFriendRequest = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/create", {
            sender: userId,
            recipient: friendId
        });

        return sendFriendRequest;
    } catch (error) {
        console.log(error.response.data);
    }
}

export const acceptFriendRequest = async (senderId, recipientId) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/accept", {
        sender: senderId,
        recipient: recipientId
    });

    return resp.data;
}

export const ignoreFriendRequest = async (senderId, recipientId) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/setStatusIgnored", {
        sender: senderId,
        recipient: recipientId
    });

    return resp.data;
}

export const cancelFriendRequest = async (senderId, recipientId) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/delete", {
        user: senderId,
        friend: recipientId
    });

    return resp.data;
}

export const removeFriend = async (userId, friendId) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/user/removeFriend", {
        user: userId,
        friend: friendId
    });
    
    return resp.data;
}

export const getPendingIncomingFriendRequests = async (userId) => {
    const friendRequests = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/getPendingIncoming", {
        recipient: userId
    });

    return friendRequests.data;
}

export const getPendingOutgoingFriendRequests = async (userId) => {
    const friendRequests = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/getPendingOutgoing", {
        sender: userId
    });

    return friendRequests.data;
}