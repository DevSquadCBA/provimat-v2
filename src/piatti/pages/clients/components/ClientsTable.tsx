import {  useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setClients } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { IClient } from '@/interfaces/dbModels';
import { Table } from '@/piatti/components/Table';
import { DataTableRowClickEvent } from "primereact/datatable";
import { getUserData, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";
import { CreateModalProps } from "@/interfaces/interfaces";

interface RootState {
    localData: {
        clients: IClient[]
    }
}


export function ClientsTable() {
    const navigate = useNavigate();
    const handleClickEvent = (event: DataTableRowClickEvent) => {
        if (event.data && 'id' in event.data) {
            const clientId = event.data.id;
            navigate(`/clientes/historial/${clientId}`);
        }
    }
    const dispatch = useDispatch();
    const clients = useSelector((state:RootState)=>state.localData.clients);
    
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
                navigate('/');
            }
        })();
    }, [dispatch,navigate]);
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'Id' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, order: false, field: 'active', header: 'Presupuestos Activos' },
        { isKey: false, order: false, field: 'total', header: 'Nº de presupuestos' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]
    const createNewModal:CreateModalProps = (
        {
            body: <></>,
            header: <></>,
            primaryButtonEvent: () => {},
            footer: <></>
        }
    )
    return <Table key={'clients'} data={clients} columns={columns} placeholder="cliente" onRowClick={handleClickEvent} newModalContent={createNewModal}/>;
}