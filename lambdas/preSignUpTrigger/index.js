import { ListUsersCommand, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event) => {
    const {
        userPoolId,
        request: { userAttributes, validationData }
    } = event;

    const email = userAttributes['email'];
    const phoneNumber = userAttributes['phone_number'];
    const preferred_username = validationData['preferred_username']

    const emailComm = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `email=\"${email}\"`
    });

    const phoneNumberComm = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `phone_number=\"${phoneNumber}\"`
    })
    
    const preferredUsernameComm = new ListUsersCommand({
        UserPoolId: userPoolId,
        Filter: `preferred_username=\"${preferred_username}\"`
    });
    
    const emailCheck = cognitoClient.send(emailComm);

    const phoneNumberCheck = cognitoClient.send(phoneNumberComm);
    
    const preferredUsernameCheck = cognitoClient.send(preferredUsernameComm);
    
    const resp = await Promise.all([emailCheck, phoneNumberCheck, preferredUsernameCheck]);
    
    const emailUsers = resp[0].Users;

    const phoneNumberUsers = resp[1].Users;
    
    const preferredUsernameUsers = resp[2].Users;
    
    if (emailUsers && emailUsers.length > 0) {
        throw Error("Email already in use");
    }

    if (phoneNumberUsers && phoneNumberUsers.length > 0) {
        throw Error("Phone number already in use");
    }
    
    if (preferredUsernameUsers && preferredUsernameUsers.length > 0) {
        throw Error("Username already in use");
    }

    event['response']['autoConfirmUser'] = true;
    event['response']['autoVerifyEmail'] = true
    event['response']['autoVerifyPhone'] = true;

    return event;
}