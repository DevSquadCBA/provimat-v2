import { Navigate, Route, Routes } from "react-router-dom";
import { TeamPage } from "../pages/TeamPage";

export function ProvidersRoutes(){
    return (
        <Routes>
            <Route path="/" element={<TeamPage />} />

            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}