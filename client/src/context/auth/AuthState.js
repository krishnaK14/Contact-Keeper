import React, {useReducer} from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    CLEAR_ERRORS,
    USER_LODED,
    AUTH_ERROR,
    LOGOUT,
} from "../types";

const AuthState= props =>{
  const intialState={
      token: localStorage.getItem('token'),
      isAuthenticated: null,
      user: null,
      loading: true,
      error: null
  };

  const [state, dispatch]=useReducer(authReducer,intialState);

  // load user
  const loadUser = async () =>{
      if(localStorage.token){
          setAuthToken(localStorage.token);
      }

      try {
          const res = await axios.get("/api/auth");
          dispatch({
              type: USER_LODED,
              payload:res.data
          })  
      } catch (err) {
          dispatch({
              type:AUTH_ERROR,
          })
      }
  }

  //register user
   const register = async formData => {
        const config={
            header:{
                "Content-Type":"application/json"
        }
    }
        try {
           const res= await axios.post("/api/users", formData, config);
           
           dispatch({
               type: REGISTER_SUCCESS,
               payload:res.data
           });
           loadUser();
        } catch (err) {
            dispatch({
                type: REGISTER_FAIL,
                payload:err.response.data.msg
            });
        }
   }

  //login user
  const login = async formData => {
    const config={
        header:{
            "Content-Type":"application/json"
    }
}
    try {
       const res= await axios.post("/api/auth", formData, config);
       
       dispatch({
           type: LOGIN_SUCCESS,
           payload:res.data
       });
       loadUser();
    } catch (err) {
        dispatch({
            type: LOGIN_FAIL,
            payload:err.response.data.msg
        });
    }
}
  //logout user
  const logout = () => {
      dispatch({type: LOGOUT});
  }  

  //clear errors
   const clearErrors = () =>{
       dispatch({type:CLEAR_ERRORS});
   }

  return(
      <AuthContext.Provider
       value={{
           token: state.token,
           isAuthenticated: state.isAuthenticated,
           user: state.user,
           loading: state.loading,
           error: state.error,
           register,
           clearErrors,
           loadUser,
           login,
           logout
       }}
      >
          {props.children}
      </AuthContext.Provider>
  );

};

export default AuthState;