import { Role } from "@/interfaces/enums";
import { ErrorResponse } from "@/interfaces/Errors";
import { changeVisibilityModalHistory } from "@/reducers/modalsSlice";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { reducers } from "@/store";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function LogModal(){
    const {modalHistoryVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean});
    const [logs, setLogs] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        (async () => {
            try{
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                if(userData.role !== Role.ADMIN){
                    dispatch(showToast({severity: 'error', summary: 'Error', detail: 'No tienes permiso para ver los logs'}));
                    dispatch(changeVisibilityModalHistory({modalHistoryVisible: false, modalHistorySale: null}));
                    return;
                }
                const response = await API.Log.get(userData.token);
                setLogs(response.map((e:{id: number, category: string, time: string, userId: number, role: string, route: string, changes: string})=>
                    ({...e,time: moment(e.time).format('DD/MM/YYYY HH:mm:ss'), changes: JSON.parse(e.changes)})));
            }catch(e){
                 if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener los registros", life: 3000 }));
                }
                console.error(e);
                
            }
        })()
    },[dispatch, navigate])
    const body = <>
    {logs &&
        <DataTable
            value={logs}
            paginator
            rows={100}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: '50rem', maxWidth: '80vw' }}
            >
            <Column field="id" header="ID" key="id" />
            <Column field="category" header="Categoría" key="category" />
            <Column field="action" header="Acción" key="action" />
            <Column field="time" header="Tiempo" key="time" />
            <Column field="user.name" header="Usuario" key="user" />
            <Column field="role" header="Rol" key="role" />
            <Column field="route" header="Ruta" key="route" />
            <Column field="changes" header="Cambios" key="changes" style={{ maxWidth: '20rem' }} />
           
        </DataTable>
    }
    </>;
    return <Dialog 
            header="Logs" 
            visible={modalHistoryVisible} 
            onHide={() => {if(!modalHistoryVisible) return; dispatch(changeVisibilityModalHistory({modalHistoryVisible: false, modalHistorySale: null})); }} 
            footer={<></>}
            >
                {body}
            </Dialog>
}