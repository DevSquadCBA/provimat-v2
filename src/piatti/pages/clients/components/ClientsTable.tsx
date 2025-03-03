import {  useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setClients } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { IClient } from '@/interfaces/dbModels';
import { Table } from '@/piatti/components/Table';
import { DataTableRowClickEvent } from "primereact/datatable";
import { getUserData, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";

interface RootState {
    localData: {
        clients: IClient[]
    }
}


export function ClientsTable() {
    const handleClickEvent = (event: DataTableRowClickEvent) => {
        if (event.data && 'clientId' in event.data) {
            const clientId = event.data.clientId;
            console.log(clientId);
            window.location.href = `clientes/historial/${clientId}`;
        }
    }
    const dispatch = useDispatch();
    const clients = useSelector((state:RootState)=>state.localData.clients);
    const navigate = useNavigate();
    
    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Client.all(userData.token);
                dispatch(setClients(response));
            }catch(e){
                removeToken();
            }
        })();
    }, [dispatch,navigate]);
    const columns = [
        { isKey: true,  order: false, field: 'clientId', header: 'Id' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, order: false, field: 'active', header: 'Presupuestos Activos' },
        { isKey: false, order: false, field: 'total', header: 'Nº de presupuestos' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]

    return <Table key={'clients'} data={clients} columns={columns} placeholder="Buscar cliente" onRowClick={handleClickEvent}/>;
}