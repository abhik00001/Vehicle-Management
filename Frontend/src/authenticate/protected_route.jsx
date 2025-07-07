import { Navigate } from "react-router";
import { isAuthenticated } from "./auth";
import { Children } from "react";

export const ProtectedRoute = ({children}) => {
    const auth = isAuthenticated()
    if (!isAuthenticated()) {
        const path = <Navigate to="/login_page" replace />
        return path
    }
    return children;
}