import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces"
import { Table } from "@/piatti/components/Table"
import { cleanAdminToken, setSales} from "@/reducers/localDataReducer"
import API from "@/services/API"
import { formatPrice, getColorOfState, getTranslationOfState, getUserData, removeToken} from "@/services/common"
import { DataTableRowClickEvent } from "primereact/datatable"
import { useDispatch, useSelector } from "react-redux"
import { reducers } from "@/store"
import { SaleHistoryModal } from "./modal/SaleHistoryModal"
import { changeVisibilityModalHistory } from "@/reducers/modalsSlice"
import moment from "moment"
import { Avatar } from "primereact/avatar"
import { SaleStates } from "@/interfaces/enums"
import { PresupuestoToProformaModal } from "@/piatti/modals/sales/PresupuestoToProformaModal"
import { ProformaToComprobanteModal } from "@/piatti/modals/sales/ProformaToComprobanteModal"
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement"
import { ClientWithBudgetData } from "@/interfaces/dto"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { showToast } from "@/reducers/toastSlice"
import { ErrorResponse } from "@/interfaces/Errors"
import { SelectButton } from "primereact/selectbutton"

type Props = {
    client:ClientWithBudgetData & { id: number } | undefined
}

const SaleTypes = [ "Presupuesto", "Proforma", "Comprobante" ];

export function ClientHistory({client}:Props) {
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const {modalPresupuestoToProformaVisible,modalProformaToComprobanteVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalPresupuestoToProformaVisible: boolean, modalProformaToComprobanteVisible:boolean, idSaleForModals: number});
    const dispatch = useDispatch();
    const {sales} = useSelector((state:reducers)=>state.localData as unknown as {sales: IHistorySales[]});
    const navigate = useNavigate();
    const mappingFunction = (sales:IHistorySales[])=>sales.map(e=>({
        ...e,
        createdAtFormatted: moment(e.createdAt).format('DD/MM/YYYY'),
        granTotal: '$ '+ formatPrice(Math.round(e.total|| 0)),
        stateFormatted: <div className="state-selector_option">
                        <Avatar className="circle-state" style={{ backgroundColor: getColorOfState(e.state as SaleStates) || '#19E052' }} shape="circle"></Avatar>
                        <span className="text-state">{getTranslationOfState(e.state||'')}</span>
                    </div>,
        states: getTranslationOfState(e.state||''),
    })) as unknown as IHistorySales[];
    const handleClick = (event:DataTableRowClickEvent)=>{
        if (event.data && 'id' in event.data) {
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: true, modalHistorySale: event.data as IHistorySales}));
        }
    }    
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'Referencia' },
        { isKey: false, order: false, field: 'stateFormatted', header: 'Estado' },
        { isKey: false, order: false, field: 'createdAtFormatted', header: 'Fecha de Inicio' },
        { isKey: false, order: false, field: 'distinctProviders', header: 'Proveedores involucrados' },
        { isKey: false, order: false, field: 'productsCount', header: 'Num Productos' },
        { isKey: false, order: false, field: 'granTotal', header: 'Total' },
        { isKey: false, order: false, field: 'states', header: 'naqve' },
    ]
    const body = (<CreateNewSaleElement />);
    const createNewModal:CreateModalProps = (
         {
             header: <h3>Nuevo Presupuesto</h3>,
             body,
             primaryButtonEvent: () => {},
             resizable: false,
             footer: <div></div>,
             onHide: ()=>window.location.reload(),
             onShow: ()=>cleanAdminToken()
         }
    )
    useEffect(() => {
        (async()=>{
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response:IHistorySales[] = await API.Sale.history(userData.token,client?.id);
                if(!response){
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener las ventas", life: 3000 }));
                    return;
                }
                dispatch(setSales(mappingFunction(response)));
            }catch(e){
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener las ventas", life: 3000 }));
                }
                console.error(e);
            }
        })();
    },[dispatch,navigate, client?.id]);
    return <> 
        <SelectButton value={SaleTypes}  />

        {client &&
            <Table 
                emptyMessage={sales && sales.length>0 ? 'No se encontraron ventas': 'El cliente no posee ventas'} 
                key={'clientHistory'} 
                data={sales} 
                columns={columns} 
                onRowClick={handleClick} 
                placeholder="Venta" 
                newModalContent={createNewModal}></Table>
        }
        {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
        {modalPresupuestoToProformaVisible && <PresupuestoToProformaModal/>}
        {modalProformaToComprobanteVisible && <ProformaToComprobanteModal/>}
    </>
}