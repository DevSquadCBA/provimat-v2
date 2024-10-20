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
        { isKey: true, field: 'id', header: 'Id' },
        { isKey: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, field: 'email', header: 'Email' },
        { isKey: false, field: 'phone', header: 'Telefono' },
        { isKey: false, field: 'address', header: 'Direccion' },
        { isKey: false, field: 'createdAt', header: 'Fecha de creacion' },
        { isKey: false, field: 'updatedAt', header: 'Fecha de actualizacion' }
    ]

    return <Table key={'clients'} data={clients} columns={columns} />;
}