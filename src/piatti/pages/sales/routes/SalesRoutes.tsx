import { Navigate, Route,Routes} from "react-router-dom";
import { PresupuestosPage } from "../pages/PresupuestosPage";
import { ComprobantesPage } from "../pages/ComprobantesPage";
import { ProformasPage } from "../pages/ProformasPage";

export function SalesRoutes(){
    return (
        <Routes>
            <Route index element={<Navigate to="comprobantes" />} />
            <Route path="/*" element={<Navigate to="comprobantes" />} />
            <Route path="comprobantes" element={<ComprobantesPage />} />
            <Route path="presupuestos" element={<PresupuestosPage />} />
            <Route path="proformas" element={<ProformasPage />} />
        </Routes>
    )
}