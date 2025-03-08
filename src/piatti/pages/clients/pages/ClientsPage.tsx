import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { ClientsTable } from "@/piatti/pages/clients/components/ClientsTable";

export function ClientsPage() {
    return <LayoutContainerTable title="Listado de Clientes"
                                tableComponents={
                                <></>// @TODO: agregar botón de nuevo cliente>
                                }>
                <ClientsTable></ClientsTable>
            </LayoutContainerTable>
}