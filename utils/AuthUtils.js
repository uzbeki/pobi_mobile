/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Gets current logged in user info
 * @example
 * {
 *      "id": "ap-northeast-1:87b3542c-cd4b-4c3f-be24-6bbf0fdb18f7",
 *      "username": "beki",
 *      "attributes": {
 *          "sub": "b602e679-8218-4e68-9db1-f74080e85131",
 *          "email_verified": true,
 *          "phone_number_verified": false,
 *          "phone_number": "+123456789",
 *          "email": "beki@gmail.com"
 *      }
 *  }
 * {
 *  id: userInfo.attributes.sub,
 *  username: userInfo.username,
 *  email: userInfo.attributes.email,
 *  phoneNumber: userInfo.attributes.phone_number,
 * }
 *
 * @returns deconstructable object, `null` if fails
 */

import { Auth, graphqlOperation, API, I18n } from "aws-amplify";
// import { useState, useEffect, useContext } from "react";
// import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
// import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
// import "../styles/Auth.css";
// import { listCourses } from "../graphql/queries";
// import { getChatInfoByUser } from "../graphql/customQueries";
// import { deleteCourse } from "../graphql/mutations";
// import config from '../config.json'
// import { globalUserContext } from "../global/globalContext";

// I18n.putVocabularies(config.languageDict);
// I18n.setLanguage("ja");


const getUserInfo = async () => {
    try {
        // return await Auth.currentUserInfo();
        return await Auth.currentAuthenticatedUser()
    } catch (error) {
        console.error(error);
        return null;
    }
};



//ユーザーログインボタン、ログアウトボタン切替
// const CheckUserLogin = () => {
//     // const [authState, setAuthState] = useState();
//     // const [user, setUser] = useState();
//     const [showAuthModal, setShowAuthModal] = useState(false);
//     const { user, setUser, authState, setAuthState } = useContext(globalUserContext)

//     useEffect(() => {
//         //ログイン状態の確認
//         Auth.currentAuthenticatedUser({
//             bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
//         })
//             .then((user) => {
//                 // setAuthState("signedin");
//                 setUser(user);
//                 if (user) setShowAuthModal(false);
//             })
//             .catch((err) => console.warn(err));

//         //authUIコンポーネントが変更されたときに呼ばれる
//         //onAuthUIStateChange function that will fire whenever the state of the Authentication UI component changes
//         return onAuthUIStateChange((nextAuthState, authData) => {
//             // console.log(nextAuthState);
//             // console.log(authData);
//             setAuthState(nextAuthState);
//             setUser(authData);
//             if (nextAuthState === AuthState.SignedIn) setShowAuthModal(false);
//         });
//     }, []);

//     return authState === AuthState.SignedIn && user ? (
//         <div className="App">
//             <div>Hello, {user.username}</div>
//             <AmplifySignOut />
//         </div>
//     ) : (
//         <div id="sign-in-btn">
//             <button onClick={() => setShowAuthModal(true)}>Sign in</button>
//             <AuthModal showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />
//         </div>
//     );
// };


// //ログインモーダル
// const AuthModal = ({ showAuthModal, setShowAuthModal }) => {
//     return showAuthModal ? (
//         <div id="overlay">
//             <div id="background" onClick={() => setShowAuthModal(false)}></div>
//             <AmplifyAuthenticator />
//         </div>
//     ) : (
//         <></>
//     );
// };



// // custom function to fetch all courses from the API
// const getCourseList = async () => {
//     try {
//         const result = await API.graphql(graphqlOperation(listCourses));
//         return result.data.listCourses.items;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// };


// const deleteCourseUtil = async (id) => {
//     console.log(id);
//     try {
//         const result = await API.graphql(graphqlOperation(deleteCourse, { input: { id } }));
//         return result.data.deleteCourse;
//     } catch (error) {
//         console.error(error);
//         return null;
//     }
// };

// const fetchChatRooms = async () => {
//     const { attributes } = await getUserInfo();
//     const userId = attributes.sub;
//     try {
//         const result = await API.graphql(graphqlOperation(getChatInfoByUser, { id: userId }));
//         return result.data.getUser.chat_member.items
//         // setChatRooms(result.data.getUser.chat_member.items);
//     } catch (error) {
//         console.error(error);
//     }
// };





// /**
//  * (Async) Updates Cognito User's attributes
//  * returns the response from the API
//  * 
//  * docs: 
//  * `https://docs.amplify.aws/guides/authentication/managing-user-attributes/q/platform/js/#writing-and-updating-standard-attributes`
//  * 
//  * @param {Object} attributes - attributes to update
//  * 
//  */
// const updateUserAttributes = async (user, {...keyValue}) => {
//     // const valid_attributes = ['address', 'birthdate', 'email', 'family name', 'gender', 'given name', 'locale', 'middle name', 'name', 'nickname', 'phone number', 'picture', 'preferred username', 'profile', 'zoneinfo', 'updated at', 'website']
//     // if (!valid_attributes.includes(attribute)) throw new Error(`${attribute} is not a valid attribute`);
//     return await Auth.updateUserAttributes(user, {
//         name: keyValue.name,
//         email: keyValue.email,
//         phone_number: keyValue.phone_number,
//         gender: keyValue.gender,
//         address: keyValue.address,
//         // username: keyValue.username,
//         // occupation: keyValue.occupation
//     } );
// }


// const updateUserPicture = async (user, pictureKey) => {
//     return await Auth.updateUserAttributes(user, { 'picture': pictureKey });
// }



















// export { getUserInfo, getCourseList, CheckUserLogin, AuthModal, deleteCourseUtil, fetchChatRooms, updateUserAttributes, updateUserPicture };
export { getUserInfo };