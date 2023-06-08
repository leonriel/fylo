import axios from 'axios';

// Use MongoDB transactions instead

export const createSession = async (userId, sessionName) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/session/create", {
        name: sessionName,
        owner: userId
    });

    return resp.data;
}

export const endSession = async (userId, session) => {
    try {
        if (userId != session.owner) {
            throw {message: "User does not have permission to end this session"};
        }
        const resp = await axios.post("http://fylo-app-server.herokuapp.com/session/end", {
            session: session._id
        });

        return resp.data;
    } catch (error) {
        return Alert.alert(error.message);
    } 
}