import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { withAuthenticator } from 'aws-amplify-react-native'
// import InputScreen from './screens/InputScreen'
// import Map from './screens/PobiMapScreen'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import config from './aws-exports'
import { getUserInfo } from "./utils/AuthUtils";

Amplify.configure({ ...config, Analytics: { disabled: true, } })

const Stack = createNativeStackNavigator();


import { globalUserContext } from "./global/globalContext";
import HomeScreen from './screens/HomeScreen';

const App = () => {
    const [user, setUser] = useState();
    const [authState, setAuthState] = useState();
    const [travel, setTravel] = useState({origin: '', destination: ''});

    useEffect(() => {
        getUserInfo().then(userInfo => {
            setUser(userInfo);
            setAuthState(userInfo ? "signedin" : "unauthenticated");
        });
        return () => {
            setUser(null);
            setAuthState(null);
        }
    }, [])

    return (
        <globalUserContext.Provider value={{ 
            user: user, setUser: setUser, 
            authState: authState, setAuthState: setAuthState,
            travel: travel, setTravel: setTravel }}>
            <NavigationContainer>
                <SafeAreaProvider>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
                    >
                        <Stack.Navigator>
                            <Stack.Screen
                                name="HomeScreen"
                                component={HomeScreen}
                                options={{
                                    headerShown: false,
                                }} />

                        </Stack.Navigator>
                    </KeyboardAvoidingView>
                </SafeAreaProvider>
            </NavigationContainer>
        </globalUserContext.Provider>
    )
}

// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: 'center', padding: 20 },
//     todo: { marginBottom: 15 },
//     input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
//     todoName: { fontSize: 18 }
// })

// export default withAuthenticator(App)
export default App