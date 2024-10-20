import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClients } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { IClient } from '@/interfaces/dbModels';
import { Table } from '@/piatti/components/Table';

interface RootState {
    localData: {
        clients: IClient[]
    }
}

export function ClientsTable() {
    const dispatch = useDispatch();
    const clients = useSelector((state:RootState)=>state.localData.clients);

    useEffect(() => {
        (async () => {
            const response = await API.Client.all();
            dispatch(setClients(response));
        })();
    }, [dispatch]);
    const columns = [
        { isKey: true,  order: false, field: 'clientId', header: 'Id' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, order: false, field: 'active', header: 'Presupuestos Activos' },
        { isKey: false, order: false, field: 'total', header: 'Nº de presupuestos' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]

    return <Table key={'clients'} data={clients} columns={columns} />;
}