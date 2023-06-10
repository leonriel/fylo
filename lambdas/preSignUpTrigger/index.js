import { ListUsersCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const {
        userPoolId,
        request: { userAttributes, validationData }
    } = event;

    const email = userAttributes['email'];
    const preferred_username = validationData['preferred_username']

    const emailComm = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `email=\"${email}\"`
    });
    
    const preferredUsernameComm = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `preferred_username=\"${preferred_username}\"`
    });
    
    const emailCheck = cognitoClient.send(emailComm);
    
    const preferredUsernameCheck = cognitoClient.send(preferredUsernameComm);
    
    const resp = await Promise.all([emailCheck, preferredUsernameCheck]);
    
    const emailUsers = resp[0].Users;
    
    const preferredUsernameUsers = resp[1].Users;
    
    if (emailUsers && emailUsers.length > 0) {
        throw Error("Email already in use");
    }
    
    if (preferredUsernameUsers && preferredUsernameUsers.length > 0) {
        throw Error("Username already in use");
    }

    return event;
}