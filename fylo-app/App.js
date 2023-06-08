import { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';

import { CognitoUserAttribute, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';

import SignUpScreen from './screens/auth/SignUpScreen';
import SignInScreen from './screens/auth/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import SessionsNavigator from './screens/SessionsNavigator';
import FriendsScreen from './screens/FriendsScreen';
import { AuthContext } from './contexts/AuthContext';
import { SessionsContext } from './contexts/SessionsContext';

import { userPool } from './utils/UserPool';
import { IDENTITY_POOL_ID, USER_POOL_ID } from '@env';

import axios from 'axios';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [sessions, setSessions] = useState([]); 
  const [user, setUser] = useState(null);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await getAuthSession();
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.warn(error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // First loading onto the app
  const getAuthSession = async () => {
    userPool.storage.sync((err, result) => {
        if (err) {
            return Alert.alert(err.message || JSON.stringify(err));
        };
  
        let cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    // Alert.alert(err.message || JSON.stringify(err));
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
  
                loadData(cognitoUser.getUsername());
                setIsSignedIn(true);
            });
        }
    });
  }

  // Might want to migrate context methods somewhere else

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
                        loadData(cognitoUser.getUsername());
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
      signUp: async (username, firstName, lastName, email, phone, password) => {
        if (!username || !firstName || !lastName || !email || !phone || !password) {
          return Alert.alert('Missing fields.');
        }

        let attributeList = [];

        let dataEmail = {
            Name: 'email',
            Value: email.toLowerCase()
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
      verifyUser: async (username, firstName, lastName, code) => {
        let userData = {
          Username: username,
          Pool: userPool
        };

        let cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(code, true, (err, result) => {
          if (err) {
            return Alert.alert(err.message || JSON.stringify(err));
          }

          // Create user in MongoDB when user has been verified
          axios.post("https://fylo-app-server.herokuapp.com/user/create", {
            username: username,
            firstName: firstName,
            lastName: lastName
          }).then((resp) => {
            console.log(resp.data.username);
          });

          console.log('call result: ' + result);
        });
      },
      refreshUser: async (username) => {
        getUser(username);
      }
    })
  )

  const sessionsContext = useMemo(
    () => ({
      reloadSessions: async (sessions) => {
        getSessions(sessions);
      }
    })
  )

  const loadData = async (username) => {
    const currentUser = await getUser(username);
    const currentSessions = await getSessions(currentUser.sessions);
  }

  // These should probably be somewhere else
  const getSessions = async (sessionIds) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/session/getMany", {sessions: sessionIds});
    setSessions(resp.data);
    return resp.data;
  }

  const getUser = async (username) => {
    const resp = await axios.post("https://fylo-app-server.herokuapp.com/user/getOne", {username: username});
    setUser(resp.data);
    return resp.data;
  }

  const onFinishedMounting = async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer onReady={onFinishedMounting}>
          {isSignedIn ? (
            user ? (
            <SessionsContext.Provider value={sessionsContext}>
              <Tab.Navigator initialRouteName='Home'>
                <Tab.Screen name="Friends" children={(props) => <FriendsScreen {...props} user={user} />} />
                <Tab.Screen name="Home" children={(props) => <HomeScreen {...props} sessions={sessions} user={user} />} />
                <Tab.Screen 
                  name="SessionsNavigator" 
                  options={{
                    headerShown: false,
                    title: "Sessions"
                  }} 
                  children={(props) => <SessionsNavigator {...props} sessions={sessions} user={user} />} 
                />
              </Tab.Navigator>
            </SessionsContext.Provider>
            ) : (
              <Text>This should be the splash screen!</Text>
            )
          ) : (
            <Stack.Navigator>
              <Stack.Screen name="Sign In" component={SignInScreen} />
              <Stack.Screen name="Sign Up" component={SignUpScreen} />
            </Stack.Navigator>
          )
          }
      </NavigationContainer>
    </AuthContext.Provider>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
