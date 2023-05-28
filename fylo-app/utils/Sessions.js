import axios from 'axios';

export const createSession = async (username, sessionName) => {
    const createSession = axios.post("https://fylo-app-server.herokuapp.com/api/createSession", {
        name: sessionName,
        owner: username
    });

    const updateUser = axios.post("https://fylo-app-server.herokuapp.com/api/setUserActiveSession", {
        username: username
    });

    const resp = await axios.all([createSession, updateUser]);

   const session = resp[0].data;

    const userResp = await axios.post("https://fylo-app-server.herokuapp.com/api/addSessionToUser", {
        username: username,
        sessionId: session._id
    });

    return userResp.data;
}