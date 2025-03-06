import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage";

export function HomeRoutes(){
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}