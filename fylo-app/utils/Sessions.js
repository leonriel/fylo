import axios from 'axios';

// Use MongoDB transactions instead

export const createSession = async (userId, sessionName) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/session/create", {
            name: sessionName,
            owner: userId
        });
    
        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
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
        return console.log(error.message);
    } 
}