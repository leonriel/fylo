import { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import axios from 'axios';

import RegisterScreen from './screens/auth/RegisterScreen';
import LoginScreen from './screens/auth/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthContext } from './contexts/AuthContext';

import { userPool } from './utils/UserPool';
import { IDENTITY_POOL_ID, USER_POOL_ID } from '@env';

const Stack = createNativeStackNavigator();

// TODO: Set up navigation from register/login to home
// TODO: Set up user auth with cognito and jwt
// TODO: Create test user

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    getSession();
  }, []);

  // First loading onto the app
  const getSession = () => {
    userPool.storage.sync((err, result) => {
        if (err) {
            return Alert.alert(err.message || JSON.stringify(err));
        };
  
        let cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    Alert.alert(err.message || JSON.stringify(err));
                    return;
                }
                console.log('session validity: ' + session.isValid());
  
                let loginKey = 'cognito-idp.us-east-2.amazonaws.com/' + USER_POOL_ID;
                let loginProvider = {}
                loginProvider[loginKey] = session.getIdToken().getJwtToken()
        
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IDENTITY_POOL_ID, 
                    Logins: loginProvider
                });
  
                setIsSignedIn(true);
            });
        }
    });
  }

  // SignUp / SignIn / SignOut functionalities
  const authContext = useMemo(
    () => ({
      signIn: async (username, password) => {
        if (!username || !password) {
          return Alert.alert('Invalid username or password combination.');
        }

        let authData = {
            Username: username,
            Password: password
        };

        let authDetails = new AuthenticationDetails(authData);

        let userData = {
            Username: username,
            Pool: userPool
        }

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
                let accessToken = result.getAccessToken().getJwtToken();

                let loginKey = 'cognito-idp.us-east-2.amazonaws.com/' + USER_POOL_ID;
                let loginProvider = {}
                loginProvider[loginKey] = result.getIdToken().getJwtToken()

                AWS.config.region = 'us-east-2';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IDENTITY_POOL_ID,
                    Logins: loginProvider
                });

                AWS.config.credentials.refresh(error => {
                    if (error) {
                        console.error(error);
                    } else {
                        // Instantiate aws sdk service objects now that the credentials have been updated.
                        // example: var s3 = new AWS.S3();
                        console.log('Successfully logged!');
                        setIsSignedIn(true);
                        
                    }
                });
            },
            onFailure: (err) => {
                return Alert.alert(err.message || JSON.stringify(err));
            }
        })  
      },
      signOut: () => {
        userPool.storage.sync((err, result) => {
          if (err) return;

          let cognitoUser = userPool.getCurrentUser();

          if (cognitoUser != null) {
              cognitoUser.signOut();
              setIsSignedIn(false);
          }
        })
      },
      signUp: async (username, email, phone, password) => {
        if (!username || !email || !phone || !password) {
          return Alert.alert('Missing fields.');
        }

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: email
        }
    
        let dataPhoneNumber = {
            Name: 'phone_number',
            Value: "+1" + phone
        }
    
        let attributeEmail = new CognitoUserAttribute(dataEmail);
        let attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
    
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
        userPool.signUp(username, password, attributeList, null, function(
            err,
            result
        ) {
            if (err) {
                return Alert.alert(err.message || JSON.stringify(err));
            }
            var cognitoUser = result.user;
            console.log('user name is ' + cognitoUser.getUsername());
        });
      },
      verifyUser: async (username, code) => {
        let userData = {
          Username: username,
          Pool: userPool
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            return Alert.alert(err.message || JSON.stringify(err));
          }

          console.log('call result: ' + result);
        });
      }
    })
  )

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <Stack.Screen name="Home" component={HomeScreen} />
          ) : (
            <>
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          )
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
