import axios from "axios";
import api from "../Api";
export function isAuthenticated(){
    const token = localStorage.getItem('access') ;
    // console.log(token)
    return !!token
}


export async function refreshAccessToken() {
    const refresh = localStorage.getItem("refresh");

    try {
        const response = await api.post("api/refresh/", {
            refresh: refresh
        });

        const newAccess = response.data.access;
        localStorage.setItem("access", newAccess);
        return newAccess;

    } catch (error) {
        console.error("Refresh failed", error);
        return null;
    }
}
