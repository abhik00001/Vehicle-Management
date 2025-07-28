import axios from "axios";

const isDevelopment = import.meta.env.MODE === 'development' 
export const MyBaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY

const api = axios.create({
    baseURL: MyBaseUrl
})


export default api;