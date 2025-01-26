import React,{ createContext, useEffect, useState } from "react";

const AuthContext= createContext({});
export const AuthProvider=({children})=>{
    const [auth, setAuth]=useState({});
    console.log("inside Auth provider");
    // useEffect(()=>{
    // if(JSON.parse(localStorage.getItem('auth'))){
    //     const a=JSON.parse(localStorage.getItem('auth'));
    //     const value={
    //         email: a.email,
    //         password: a.password,
    //         accessToken: a.accessToken 
    //     };
    //     setAuth(value);
    //     console.log("a :   "+a.email);
    //     // setAuth(JSON.parse(localStorage.getItem('auth')));
    // }
    // },[]);
    return(
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    )
} 

export default AuthContext;