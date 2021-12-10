import { createContext } from 'react'


// logged in user info is universal for every component, so we can put it in global context
const globalUserContext = createContext({
    user: null,
    authState: null,
    setAuthState: () => { },
    setUser: () => { },
    travel: {origin: '', destination: ''},
    setTravel: () => { },
});

// const globalTavelContext = createContext({
//     travel: {origin: '', destination: ''},
//     setTravel: () => { },
// });
// app theme (dark or white themes ) is also universal for every component [NOT USED for now]
// const globalThemeContext = createContext({
//     theme: 'dark',
//     setTheme: () => { },
// });


// app language context could be a global variable [NOT USED for now]
// const languageContext = createContext({
//     language: 'ja',
//     setLanguage: () => { },
// });





export { globalUserContext };