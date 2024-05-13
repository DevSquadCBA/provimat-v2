import { Navigate, Route, Routes } from "react-router-dom";
import { ProvidersPage } from "../pages/ProvidersPage";

export function ProvidersRoutes(){
    return (
        <Routes>
            <Route path="/" element={<ProvidersPage />} />

            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}