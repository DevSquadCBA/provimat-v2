import { IProvider } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { setProviders } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface RootState {
    localData: {
        providers: IProvider[]
    }
}

export function ProvidersTable() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const providers = useSelector((state:RootState)=>state.localData.providers);

    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Provider.all(userData.token);
                dispatch(setProviders(response));
            }catch(e){
                removeToken();
                navigate('/');
            }
            
        })();
    }, [dispatch, navigate]);

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'cuit_cuil', header: 'CUIT/CUIL' },
        { isKey: false, order: false, field: 'daysDelays', header: 'Dias de retraso' },
        { isKey: false, order: false, field: '', header: '' }
    ]

    return <Table key={'providers'} data={providers} columns={columns}  placeholder="Buscar proveedor"/>;
    
}