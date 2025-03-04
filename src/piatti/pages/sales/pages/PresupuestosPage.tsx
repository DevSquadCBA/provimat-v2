import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { PresupuestosTable } from "../components/PresupuestosTable";
export function PresupuestosPage() {

    return <LayoutContainerTable title="Listado de Presupuestos" tableComponents={<></>}>
        <PresupuestosTable></PresupuestosTable>
    </LayoutContainerTable>
}