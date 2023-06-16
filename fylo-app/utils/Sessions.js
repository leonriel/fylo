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
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/session/end", {
            session: session._id
        });

        return resp.data;
    } catch (error) {
        console.log(error.message);
    } 
}

export const sendSessionInvite = async (senderId, recipientId, session) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/create", {
            sender: senderId,
            recipient: recipientId,
            session: session
        });

        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const acceptSessionInvite = async (senderId, recipientId, session) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/accept", {
            sender: senderId,
            recipient: recipientId,
            session: session
        });

        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const getPendingIncomingSessionInvites = async (recipientId) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/getPendingIncoming", {
            recipient: recipientId
        });

        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const getPendingOutgoingSessionInvites = async (sessionId) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/getPendingOutgoing", {
            session: sessionId
        })

        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
}