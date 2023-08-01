import axios from 'axios';
import { Alert } from 'react-native';
import { Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

// Use MongoDB transactions instead

export const createSession = async (userId, sessionName) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/session/create", {
            name: sessionName,
            owner: userId
        });
    
        return resp.data;
    } catch (error) {
        throw new Error(error.response.data);
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

export const removeCollaborator = async (userId, session, collaboratorId) => {
    try {
        
    } catch (error) {
        
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
        console.log(error.response.data);
    }
}

export const acceptSessionInvite = async (senderId, recipientId, session) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/accept", {
        sender: senderId,
        recipient: recipientId,
        session: session
    });

    return resp.data;
}

export const ignoreSessionInvite = async (senderId, recipientId, session) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/setStatusIgnored", {
            sender: senderId,
            recipient: recipientId,
            session: session
        });

        return resp.data;
    } catch (error) {
        console.log(error.message);
    }
}

export const cancelSessionInvite = async (senderId, recipientId, session) => {
    try {
        const resp = await axios.post("https://fylo-app-server.herokuapp.com/sessionInvite/delete", {
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

export const uploadPhoto = async (session, imgBlob, owner, type) => {
    try {
        if (!session.contributors.includes(owner._id)) {
            throw new Error("User does not have permission to add to this session.");
        }

        const fileName = Date.now() + uuidv4();

        const { key } = await Storage.put(`${session._id}/${fileName}`, imgBlob, {
            contentType: type == "image" ? "image/jpeg" : "video/quicktime",
            useAccelerateEndpoint: true
        });

        try {
            await axios.post("https://fylo-app-server.herokuapp.com/session/addPhoto", {
                session: session._id,
                key: key,
                owner: owner._id,
                type: type
            })
        } catch (error) {
            throw error.message;
        }

    } catch (error) {
        console.log(error.message);
    }
}