import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable";
import { TeamTable } from "../components/TeamTable";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { reducers } from "@/store";
import { LogModal } from "@/piatti/modals/logs/LogModal";
import { changeVisibilityModalHistory } from "@/reducers/modalsSlice";
import { getUserData } from "@/services/common";
import { Role } from "@/interfaces/enums";
export function TeamPage() {
    const userData = getUserData();
    const {modalHistoryVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean});
    const dispatch = useDispatch();
    const components = <>
        {modalHistoryVisible && <LogModal/>}
        {userData?.role == Role.ADMIN && 
        <Button onClick={()=>dispatch(changeVisibilityModalHistory({modalHistoryVisible: true, modalHistorySale: null}))}>Ver Registros</Button>
        }
    </>
    return <LayoutContainerTable title="Equipo de Trabajo" tableComponents={components}>
            <TeamTable></TeamTable>
        </LayoutContainerTable>
}
