// import { Route, Router, Routes } from "react-router-dom";
import { ClientsRoutes } from "../pages/clients/routes/ClientsRoutes";
import { ProvidersRoutes } from "../pages/providers/routes/ProvidersRoutes";
import { ProductsRoutes } from "../pages/products/routes/ProductsRoutes";
import { SalesRoutes } from "../pages/sales/routes/SalesRoutes";

import { Navigate, Route, Routes } from "react-router-dom";

export function MainRoutes(){
    return (
        <Routes>
            {/* @TODO: en un futuro, este /clientes, deberia ser /home */}
            <Route path="*" element={<Navigate to="/clientes" replace/>} />
            
            <Route path="/clientes/*" element={<ClientsRoutes />} />
            <Route path="/proovedores" element={<ProvidersRoutes />} />
            <Route path="/productos" element={<ProductsRoutes />} />
            <Route path="/ventas/*" element={<SalesRoutes/>}></Route>
        </Routes>
    )
}