import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { ProvidersTable } from "../components/ProvidersTable";

export function ProvidersPage() {
    return <LayoutContainerTable title="Listado de Proveedores" tableComponents={<></>}>
            <ProvidersTable></ProvidersTable>
        </LayoutContainerTable>
}
