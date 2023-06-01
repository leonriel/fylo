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

export const addFriend = async (user, friend) => {
    const addFriend = axios.post("https://fylo-app-server.herokuapp.com/user/addFriend", {
        username: user.username,
        friend: friend.username
    });

    return addFriend;
}

export const removeFriend = async (user, friend) => {
    return axios.post("https://fylo-app-server.herokuapp.com/user/removeFriend", {
        username: user.username,
        friend: friend
    }); 
}