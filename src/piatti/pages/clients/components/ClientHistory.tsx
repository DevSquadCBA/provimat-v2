import { IClient } from "@/interfaces/dbModels"
import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces"
import { Table } from "@/piatti/components/Table"
import { setSales } from "@/reducers/localDataReducer"
import API from "@/services/API"
import { formatPrice, getColorOfState, getTranslationOfState, getUserData, removeToken } from "@/services/common"
import { DataTableRowClickEvent } from "primereact/datatable"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { reducers } from "@/store"
import { SaleHistoryModal } from "./SaleHistoryModal"
import { changeVisibilityModalHistory } from "@/reducers/modalsSlice"
import moment from "moment"
import { Avatar } from "primereact/avatar"
import { SaleStates } from "@/interfaces/enums"

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
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const handleClick = (event:DataTableRowClickEvent)=>{
        if (event.data && 'id' in event.data) {
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: true, modalHistorySale: event.data as IHistorySales}));
        }
    }
    const dispatch = useDispatch();
    let sales = useSelector((state:RootState)=>state.localData.sales)
    console.log(sales);
    if(sales)
        sales = sales.map(e=>({
                    ...e,
                    createdAt: moment(e.createdAt).format('DD/MM/YYYY'),
                    granTotal: '$ '+ formatPrice(e.total || 0),
                    stateFormatted: <div className="state-selector_option">
                                    <Avatar className="circle-state" style={{ backgroundColor: getColorOfState(e.state as SaleStates) || '#19E052' }} shape="circle"></Avatar>
                                    <span className="text-state">{getTranslationOfState(e.state||'')}</span>
                                </div>,
                })) as unknown as IHistorySales[];
    
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
        { isKey: false, order: false, field: 'stateFormatted', header: 'Estado' },
        { isKey: false, order: false, field: 'createdAt', header: 'Fecha de Inicio' },
        { isKey: false, order: false, field: 'distinctProviders', header: 'Proveedores involucrados' },
        { isKey: false, order: false, field: 'productsCount', header: 'Num Productos' },
        { isKey: false, order: false, field: 'granTotal', header: 'Total' },
    ]
    const createNewModal:CreateModalProps = (
            {
                body: <></>,
                header: <></>,
                primaryButtonEvent: () => {},
                footer: <></>
            }
        )
    return <> 
        {client &&
            <Table key={'clientHistory'} data={sales} columns={columns} onRowClick={handleClick} placeholder="Venta" newModalContent={createNewModal}></Table>
        }
        {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
    </>
}