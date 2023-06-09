import { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SplashScreen from 'expo-splash-screen';

import { Amplify, Auth, Hub } from 'aws-amplify';

import SignUpScreen from './screens/auth/SignUpScreen';
import SignInScreen from './screens/auth/SignInScreen';
import HomeScreen from './screens/HomeScreen';
import SessionsNavigator from './screens/SessionsNavigator';
import FriendsScreen from './screens/FriendsScreen';
import { AuthContext } from './contexts/AuthContext';
import { SessionsContext } from './contexts/SessionsContext';

import { IDENTITY_POOL_ID, USER_POOL_ID, CLIENT_ID } from '@env';

import axios from 'axios';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync();

Amplify.configure({
  Auth: {
    region: "us-east-2",
    identityPoolId: IDENTITY_POOL_ID,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
    mandatorySignIn: true
  }
});

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
    Auth.currentAuthenticatedUser().then((user) => {
      Auth.currentSession().then((data) => {
        loadData(user.getUsername());
        setIsSignedIn(true);
      }).catch((error) => {
        return
      })
    }).catch((error) => {
      return
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

        try {
          const user = await Auth.signIn(username, password);
          setIsSignedIn(true);
          loadData(user.getUsername());
        } catch (error) {
          console.log(error);
        } 
      },
      signOut: async () => {
        try {
          await Auth.signOut();
          setIsSignedIn(false);
        } catch (error) {
          console.log(error);
        }
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
