import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { ComprobantesTable } from "../components/ComprobantesTable";
export function ComprobantesPage() {

    return <LayoutContainerTable title="Listado de Comprobantes" tableComponents={<></>}>
        <ComprobantesTable></ComprobantesTable>
    </LayoutContainerTable>
}