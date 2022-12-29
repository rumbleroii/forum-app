import React from 'react'

const API_ENDPOINT = "http://localhost:5000/api/auth";

import jwt_decode from 'jwt-decode';
import axios from 'axios';
import useUserStore from './Store';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { axiosInstance } from './AxiosInstance';


const loginReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
                emailWrong: false,
                registerDirect: false,
            }
        case "DIRECT_LOGIN":
            return {
                ...state,
                isLoading: false,
                isError: false,
                emailWrong: false,
                registerDirect: false,
            }

        case "DIRECT_REGISTER":
            return {
                ...state,
                isLoading: false,
                isError: false,
                emailWrong: false,
                registerDirect: true,
            }
        
        case "EMAIL_ERROR":
            return  {
                ...state,
                isLoading: false,
                isError: true,
                emailWrong: true,
                registerDirect: false,
            }

        default:
            return {
                ...state,
                isLoading: false,
                isError: true,
                emailWrong: false,
                registerDirect: false,
            }
    }
}

const GoogleAuth = () => {

    // Global State
    const setUser = useUserStore((state) => state.setUser);
    const user = useUserStore((state) => state.authUser);

    // Local State
    const [login, dispatchLogin] = React.useReducer(
        loginReducer,
        {isLoading:false, isError: false, emailWrong: false, registerDirect: false}
    )
    const [isLogged, setIsLogged] = React.useState(false);  

    // Navigate
    const navigate = useNavigate();


    const handleCallbackResponse = async (res) => {

        // Dispatch Login Init Notice
        dispatchLogin({
            type: "LOGIN_INIT"
        })

        const userObj = jwt_decode(res.credential);

        try {
            const server_session_token = await axiosInstance.post('/auth/login', {
                data: {
                    email: userObj.email
                }
            })
            
            // Persistent User
            const userPersistentData = {
                name: userObj.name,
                email: userObj.email,
                firstname: userObj.given_name,
                picture: userObj.picture
            }

            setUser(userPersistentData, server_session_token.data.accessToken);

            // Direct Login Notice
            dispatchLogin({
                type: "DIRECT_LOGIN",
            })

            return navigate('/home');
            
        } catch (err) {
            console.log(err);
            
            if(err.code === "ERR_NETWORK") return dispatchLogin({});
                
            // Wrong Email Notice
            if(err.response.data.msg === "Sign in through Institute Email") return dispatchLogin({ type: "EMAIL_ERROR" }) 
            

            // Direct Register 
            if(err.response.data.errors[0].msg = 'Organization / User does not exists'){
                    // Register direct
                    dispatchLogin({
                        type: "DIRECT_REGISTER",
                    })

                    // Persistent User
                    const userPersistentData = {
                        name: userObj.name,
                        email: userObj.email,
                        firstname: userObj.given_name,
                        picture: userObj.picture
                    }
                    
                    return navigate('/register', {state:{...userPersistentData}});
            } 

            // Unknown Error
            if(err) return dispatchLogin({});
        }
    }   

    React.useEffect(() => {
            if(user === null) {
                 /* global google */
                google.accounts.id.initialize({
                    client_id: "138855030369-1f64s62cjtdqeh8ad368n66h16svv59s.apps.googleusercontent.com",
                    callback: handleCallbackResponse
                })
        
                google.accounts.id.renderButton(
                    document.getElementById("signInDiv"),
                    { theme: 'outline', size: 'large' }
                );
        
                return google.accounts.id.prompt();

            } else return setIsLogged(true);
            
    },[])

    return (
        <div>
            {login.isLoading ?  (<div className='py-4' id='loading_status'>Loading...</div>) : null}
            {login.isError ?  (<div className='text-red-700 font-bold' id='error_status'>Error, Try Again</div>) : null}
            {login.emailWrong ?  (<div className='text-pink-700' id='error_status'>Please Use Institute Email</div>) : null}
            {login.registerDirect ? <div>Redirecting To Register Page</div> : null}
            {!isLogged ? <div id='signInDiv'></div> : <p>User Logged In, Go To Home <Link to='/home'>HOME</Link></p>}
        </div> 
    )
}

export default GoogleAuth