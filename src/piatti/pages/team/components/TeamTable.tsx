import { IUser } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { setTeam} from '@/reducers/localDataReducer';
import API from "@/services/API";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


interface RootState {
    localData: {
        team: IUser[]
    }
}

export function TeamTable() {
    const dispatch = useDispatch();
    const team = useSelector((state:RootState)=>state.localData.team);

    useEffect(() => {
        (async () => {
            const response = await API.User.all();
            dispatch(setTeam(response));
        })();
    }, [dispatch]);
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'email', header: 'Email' },
        { isKey: false, order: false, field: 'role', header: 'Rol' },
        { isKey: false, order: false, field: 'active', header: 'Activo' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]
    return <Table key={'team'} data={team} columns={columns} placeholder="Buscar usuario"/>;
}