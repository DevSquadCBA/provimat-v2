import { Navigate, Route, Routes } from "react-router-dom";
import { ClientsPage } from "../pages/ClientsPage";
import { HistoryClientPage } from "../pages/HistoryClientPage";

export function ClientsRoutes(){
    return (
        <Routes>
            <Route index element={<ClientsPage />} />
            <Route path="historial" element={<HistoryClientPage />} />
            <Route path="*" element={<Navigate to="/clientes" replace/>} />
        </Routes>
    )
}