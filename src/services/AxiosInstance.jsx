import axios from 'axios';

const BASE_URL = "http://localhost:5000/api/"

const getToken = () => localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).state.sessionToken : null;

export const getAuthorizationHeader = () => getToken();

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'x-auth-token': getAuthorizationHeader()
    }
})
