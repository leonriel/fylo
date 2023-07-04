import 'react-native-gesture-handler'; // Required for react-navigation
import 'react-native-url-polyfill/auto'; // Required for AWS Cognito (Amplify Auth)
import 'react-native-get-random-values'; // Required for AWS Cognito (Amplify Auth)

import { useState, useEffect, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Dimensions, ActivityIndicator, SafeAreaView, Pressable, Text,View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Amplify, Auth, Hub } from 'aws-amplify';

import LandingScreen from './screens/auth/LandingScreen';
import SignInScreen from './screens/auth/SignInScreen';
import NameScreen from './screens/auth/NameScreen';
import ContactInfoScreen from './screens/auth/ContactInfoScreen';
import CredentialsScreen from './screens/auth/CredentialsScreen';
import VerificationScreen from './screens/auth/VerificationScreen';
import HomeScreen from './screens/HomeScreen';
import SessionsNavigator from './screens/sessions/SessionsNavigator';
import PlaygroundScreen from './screens/PlaygroundScreen';
import ProfileIcon from './components/ProfileIcon';
import { AuthContext } from './contexts/AuthContext';
import { SessionsContext } from './contexts/SessionsContext';

import { IDENTITY_POOL_ID, USER_POOL_ID, CLIENT_ID } from '@env';

import axios from 'axios';

const AuthStack = createStackNavigator();

const Tab = createMaterialTopTabNavigator();

SplashScreen.preventAutoHideAsync();

Amplify.configure({
  Auth: {
    region: "us-east-2",
    identityPoolId: IDENTITY_POOL_ID,
    userPoolId: USER_POOL_ID,
    userPoolWebClientId: CLIENT_ID,
    mandatorySignIn: true
  },
  Storage: {
    AWSS3: {
      bucket: 'fylo-photos',
      region: 'us-east-2'
    }
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
        await Font.loadAsync({
          "Quicksand-Light": require('./assets/Quicksand/static/Quicksand-Light.ttf'),
          "Quicksand-Regular": require('./assets/Quicksand/static/Quicksand-Regular.ttf'),
          "Quicksand-Medium": require('./assets/Quicksand/static/Quicksand-Medium.ttf'),
          "Quicksand-SemiBold": require('./assets/Quicksand/static/Quicksand-SemiBold.ttf'),
          "Quicksand-Bold": require('./assets/Quicksand/static/Quicksand-Bold.ttf'),
        });
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
        loadData(user.attributes.preferred_username);
        setIsSignedIn(true);
      }).catch((error) => {
        return
      })
    }).catch((error) => {
      return
    });
  }

  // SignUp / SignIn / SignOut functionalities
  const authContext = useMemo(
    () => ({
      signIn: async (username, password) => {
        if (!username || !password) {
          return Alert.alert('Invalid username or password combination.');
        }

        try {
          const user = await Auth.signIn(username.toLowerCase(), password);
          setIsSignedIn(true);
          loadData(user.attributes.preferred_username);
        } catch (error) {
          console.log(error);
        } 
      },
      autoSignIn: async (username) => {
        Hub.listen('auth', async ({ payload }) => {
          const { event } = payload;
          if (event == 'autoSignIn') {
            const user = payload.data;
            await Auth.updateUserAttributes(user, {
              preferred_username: username
            })
            setIsSignedIn(true);
            loadData(username);
          } else if (event == 'autoSignIn_failure') {
            return
          }
        })
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

  const authScreenOptions = {
    title: "",
    headerStyle: {
      backgroundColor: "white"
    },
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    headerBackImage: () => <Ionicons name="chevron-back-outline" size={24} color="black" />
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AuthContext.Provider value={authContext}>
        <StatusBar style="auto" />
        <SafeAreaProvider>
          <NavigationContainer onReady={onFinishedMounting} theme={{...DefaultTheme, colors: {...DefaultTheme.colors, background: "white"}}}>
              {isSignedIn ? (
                user ? (
                <SessionsContext.Provider value={sessionsContext}>
                    <SafeAreaView>
                      <View style={styles.header}>
                        <FastImage style={styles.logo} source={require('./assets/logo-black.png')} />
                      </View>
                    </SafeAreaView>
                    <Tab.Navigator 
                      initialRouteName='Home' 
                      tabBarPosition='bottom' 
                      initialLayout={{width: Dimensions.get('window').width}} 
                      // tabBar={({navigation}) => {
                      //   return (<SafeAreaView>
                      //     <View style={styles.header}>
                      //       {/* {navigation.getState().index == 1 && <Pressable onPress={() => navigation.jumpTo("Playground")}>
                      //         <ProfileIcon firstName={user.firstName} lastName={user.lastName} />
                      //       </Pressable>} */}
                      //       <FastImage style={styles.logo} source={require('./assets/logo-black.png')} />
                      //       {/* {navigation.getState().index == 1 && <Pressable onPress={() => navigation.jumpTo("Sessions Navigator")}>
                      //         <Ionicons name="albums-outline" size={30} color="black" />                        
                      //       </Pressable>} */}
                      //     </View>
                      // </SafeAreaView>)}}
                      screenOptions={{
                        tabBarStyle: {
                          height: "8%",
                          backgroundColor: "powderblue",
                          borderRadius: 20,
                          shadowOffset: { width: 0, height: -3},
                          shadowOpacity: 0.2,
                          shadowRadius: 5
                        },
                        tabBarIndicator: () => {
                          return null
                        },
                        animationEnabled: false
                          // swipeEnabled: false
                      }}
                      >
                      {/* <Tab.Screen name="Friends" children={(props) => <FriendsScreen {...props} user={user} />} /> */}
                      <Tab.Screen 
                          name="Playground"
                          children={(props) => <PlaygroundScreen {...props} sessions={sessions} user={user} />}
                          options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({focused, color}) => {
                              return (
                                focused ? <Ionicons name="person" size={24} color="black" /> : <Ionicons name="person-outline" size={24} color="black" />
                              )
                            }
                          }}
                      />
                      <Tab.Screen 
                          name="Home" 
                          children={(props) => <HomeScreen {...props} sessions={sessions} user={user} />} 
                          options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({focused, color}) => {
                              return (
                                focused ? <Ionicons name="home" size={24} color="black" /> : <Ionicons name="home-outline" size={24} color="black" />
                              )
                            }
                          }}
                      />
                      <Tab.Screen 
                          name="Sessions Navigator" 
                          children={(props) => <SessionsNavigator {...props} sessions={sessions} user={user} />} 
                          options={{
                            tabBarShowLabel: false,
                            tabBarIcon: ({focused, color}) => {
                              return (
                                focused ? <Ionicons name="albums" size={24} color="black" /> : <Ionicons name="albums-outline" size={24} color="black" />
                              )
                            }
                          }}
                      />
                  </Tab.Navigator>
                </SessionsContext.Provider>
                ) : (
                  <ActivityIndicator />
                )
              ) : (
                <AuthStack.Navigator initialRoutName="Landing">
                  <AuthStack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} />
                  <AuthStack.Screen name="Sign In" component={SignInScreen} options={authScreenOptions} />
                  <AuthStack.Screen name="Sign Up 1" component={NameScreen} options={authScreenOptions} />
                  <AuthStack.Screen name="Sign Up 2" component={CredentialsScreen} options={authScreenOptions} />
                  <AuthStack.Screen name="Sign Up 3" component={ContactInfoScreen} options={authScreenOptions} />
                  <AuthStack.Screen name="Sign Up 4" component={VerificationScreen} options={authScreenOptions} />
                </AuthStack.Navigator>
              )
              }
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthContext.Provider>
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    alignSelf: "center", 
    width: "90%",
    height: 30
  },
  logo: {
      height: 30, 
      aspectRatio: "228/76",
      marginRight: 'auto',
      marginLeft: 'auto'
  }
});
