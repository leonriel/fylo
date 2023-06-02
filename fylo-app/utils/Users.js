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
        const res = await axios.post("https://fylo-app-server.herokuapp.com/user/search", {
            query: query
        });
    
        return res.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const sendFriendRequest = async (user, friend) => {
    const sendFriendRequest = axios.post("https://fylo-app-server.herokuapp.com/friendRequest/create", {
        sender: user.username,
        receiver: friend.username
    });

    return sendFriendRequest;
}

export const acceptFriendRequest = async (user, friend) => {
    const updateFriendRequest = axios.post("https://fylo-app-server.herokuapp.com/friendRequest/setStatusAccepted", {
        sender: user.username,
        receiver: friend.username
    });

    const updateUsers = axios.post('https://fylo-app-server.herokuapp.com/user/addFriendMutually', {
        username: user.username,
        friend: friend.username
    });

    return axios.all([updateFriendRequest, updateUsers]);
}

export const removeFriend = async (user, friend) => {
    const updateUsers = axios.post("https://fylo-app-server.herokuapp.com/user/removeFriendMutually", {
        username: user.username,
        friend: friend.username
    });
    
    const deleteFriendRequest = axios.post("https://fylo-app-server.herokuapp.com/friendRequest/delete", {
        username: user.username,
        friend: friend.username
    });
    
    return axios.all([updateUsers, deleteFriendRequest])
}

export const getPendingIncomingFriendRequests = async (user) => {
    const friendRequests = await axios.post("https://fylo-app-server.herokuapp.com/friendRequest/getPendingIncoming", {
        receiver: user.username
    });

    return friendRequests
}