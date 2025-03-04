import { Navigate, Route, Routes } from "react-router-dom";
import { TeamPage } from "../pages/TeamPage";

export function TeamRoutes(){
    return (
        <Routes>
            <Route path="/" element={<TeamPage />} />

            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}