import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { TeamTable } from "../components/TeamTable";
export function TeamPage() {
    return <LayoutContainerTable title="Equipo de Trabajo" tableComponents={<></>}>
            <TeamTable></TeamTable>
        </LayoutContainerTable>
}
