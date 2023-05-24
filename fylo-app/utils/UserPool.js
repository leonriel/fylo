import { CognitoUserPool } from 'amazon-cognito-identity-js';

import { USER_POOL_ID, CLIENT_ID } from '@env';

const poolData = {
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID
}

export const userPool = new CognitoUserPool(poolData);