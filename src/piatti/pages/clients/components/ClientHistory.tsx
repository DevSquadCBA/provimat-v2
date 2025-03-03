import { IClient } from "@/interfaces/dbModels"
import { IHistorySales } from "@/interfaces/interfaces"
import { Table } from "@/piatti/components/Table"
import { setSales } from "@/reducers/localDataReducer"
import API from "@/services/API"
import { getUserData, removeToken } from "@/services/common"
import { DataTableRowClickEvent } from "primereact/datatable"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

type Props = {
    client:IClient & { id: number } | undefined
}
interface RootState {
    localData: {
        sales: IHistorySales[]
    }
}
export function ClientHistory({client}:Props) {
    const navigate = useNavigate();
    const handleClick = (event:DataTableRowClickEvent)=>{
        if (event.data && 'id' in event.data) {
            const orderId = event.data.id;
            console.log(orderId);
            // show a modal with the ordeer
            //navigate(`/ventas/${orderId}`);
        }
    }
    const dispatch = useDispatch();
    const sales = useSelector((state:RootState)=>state.localData.sales);
    
    useEffect(() => {
        (async()=>{
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response:IHistorySales[] = await API.Sale.history(client?.id, userData.token);
               // response = response.map(e=>({...e, createdAt: convertToVerboseDay(e.createdAt)}));
                dispatch(setSales(response));
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    },[dispatch,navigate, client?.id]);
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'Referencia' },
        { isKey: false, order: false, field: 'state', header: 'Estado' },
        { isKey: false, order: false, field: 'createdAt', header: 'Fecha de Inicio' },
        { isKey: false, order: false, field: 'distinctProviders', header: 'Proveedores involucrados' },
        { isKey: false, order: false, field: 'productsCount', header: 'Num Productos' },
        { isKey: false, order: false, field: 'granTotal', header: 'Total' },
    ]
    return <> 
        {client &&
            // <>Soy el historial de {client.name}</>
            <Table key={'clientHistory'} data={sales} columns={columns} onRowClick={handleClick}></Table>
        }
    </>
}