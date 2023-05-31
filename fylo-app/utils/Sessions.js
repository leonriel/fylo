import axios from 'axios';

export const createSession = async (username, sessionName) => {
    const createSession = axios.post("https://fylo-app-server.herokuapp.com/session/create", {
        name: sessionName,
        owner: username
    });

    const updateUser = axios.post("https://fylo-app-server.herokuapp.com/user/hasActiveSession", {
        username: username
    });

    const resp = await axios.all([createSession, updateUser]);

   const session = resp[0].data;

    const userResp = await axios.post("https://fylo-app-server.herokuapp.com/user/addSession", {
        username: username,
        sessionId: session._id
    });

    return userResp.data;
}

export const endSession = async (username, session) => {
    try {
        if (username != session.owner) {
            throw {message: "User does not have permission to end this session"};
        }
        const setSessionInactive = axios.post("http://fylo-app-server.herokuapp.com/session/end", {
            sessionId: session._id
        });

        const updateUsers = axios.post("http://fylo-app-server.herokuapp.com/user/endSessionForAll", {
            contributors: session.contributors
        })

        const resp = await axios.all([setSessionInactive, updateUsers]);

        return resp[0].data;
    } catch (error) {
        return Alert.alert(error.message);
    } 
}