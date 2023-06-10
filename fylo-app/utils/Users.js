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

export const searchUsers = async (query) => {
    try {
        const res = await axios.post("https://fylo-app-server.herokuapp.com/user/globalSearch", {
            query: query
        });

        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const sendFriendRequest = async (user, friend) => {
    const sendFriendRequest = axios.post("https://fylo-app-server.herokuapp.com/friendRequest/create", {
        sender: user._id,
        recipient: friend._id
    });

    return sendFriendRequest;
}

export const acceptFriendRequest = async (sender, recipient) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/accept", {
        sender: sender._id,
        recipient: recipient._id
    });

    return resp.data;
}

export const removeFriend = async (user, friend) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/user/removeFriend", {
        user: user._id,
        friend: friend._id
    });
    
    return resp.data;
}

export const getPendingIncomingFriendRequests = async (user) => {
    const friendRequests = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/getPendingIncoming", {
        recipient: user._id
    });

    return friendRequests.data;
}