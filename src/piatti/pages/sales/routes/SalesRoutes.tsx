import { Navigate, Route,Routes} from "react-router-dom";
import { PresupuestosPage } from "../pages/PresupuestosPage";
import { ComprobantesPage } from "../pages/ComprobantesPage";
import { ProformasPage } from "../pages/ProformasPage";

export function SalesRoutes(){
    return (
        <Routes>
            <Route index element={<PresupuestosPage />} />
            <Route path="/*" element={<Navigate to="presupuestos" />} />
            <Route path="comprobantes" element={<ComprobantesPage />} />
            <Route path="presupuestos" element={<PresupuestosPage />} />
            <Route path="proformas" element={<ProformasPage />} />
        </Routes>
    )
}