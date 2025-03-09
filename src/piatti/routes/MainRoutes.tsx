// import { Route, Router, Routes } from "react-router-dom";
import { ClientsRoutes } from "../pages/clients/routes/ClientsRoutes";
import { ProvidersRoutes } from "../pages/providers/routes/ProvidersRoutes";
import { ProductsRoutes } from "../pages/products/routes/ProductsRoutes";
import { SalesRoutes } from "../pages/sales/routes/SalesRoutes";
import { TeamRoutes } from "../pages/team/routes/TeamRoutes";

import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../pages/Auth/routes/AuthRoutes";
import { HomeRoutes } from "../pages/home/routes/HomeRoutes";

export function MainRoutes(){
    return (
        <Routes>
            <Route path="/*" element={<Navigate to="/home" replace/>} />
            <Route path="/home" element={<HomeRoutes />} />
            <Route path="/clientes/*" element={<ClientsRoutes />} />
            <Route path="/proovedores" element={<ProvidersRoutes />} />
            <Route path="/productos" element={<ProductsRoutes />} />
            <Route path="/ventas/*" element={<SalesRoutes/>} />
            <Route path="/equipo" element={<TeamRoutes />} />
            <Route path="/" element={<AuthRoutes />} />
        </Routes>
    )
}