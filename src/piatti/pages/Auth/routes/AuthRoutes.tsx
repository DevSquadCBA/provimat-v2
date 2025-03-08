import { Route, Routes } from "react-router-dom";
import { AuthPage } from "../pages/AuthPage";

export function AuthRoutes(){
    return (
        <Routes>
            <Route index element={<AuthPage />} />
        </Routes>
    )
}