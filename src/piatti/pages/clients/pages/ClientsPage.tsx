import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { ClientsTable } from "../components/ClientsTable";

export function ClientsPage() {
    return <LayoutContainerTable>
            <ClientsTable></ClientsTable>
        </LayoutContainerTable>
}