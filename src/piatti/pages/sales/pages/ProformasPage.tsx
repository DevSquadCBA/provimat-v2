import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { ProformasTable } from "../components/ProformasTable";
export function ProformasPage() {

    return <LayoutContainerTable title="Listado de Proformas" tableComponents={<></>}>
        <ProformasTable></ProformasTable>
    </LayoutContainerTable>
}