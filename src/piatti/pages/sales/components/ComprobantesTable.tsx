import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanAdminToken,  setSales } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { formatPrice, getPercentOfState, getUserData, removeToken } from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { useNavigate } from "react-router-dom";
import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces";
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement";
import { changeVisibilityModalHistory } from "@/reducers/modalsSlice";
import { DataTableRowClickEvent } from "primereact/datatable";
import { SaleHistoryModal } from "../../clients/components/SaleHistoryModal";
import { reducers } from "@/store";
import moment from "moment";
import { SaleStates } from "@/interfaces/enums";
import { ProgressBar } from "primereact/progressbar";
import { Chip } from "primereact/chip";


interface RootState {
    localData: {
        sales: ISale[]
    }
}


export function ComprobantesTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const comprobantes = useSelector((state:RootState)=>state.localData.sales);
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});

    useEffect(() => {
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                let response = await API.Sale.get('comprobante',userData.token);
                if(!response) return;
                response = response.map((e:ISale) =>({
                    ...e,
                    totalFormatted: '$'+ formatPrice(e.total || 0),
                    createdAtFormatted: moment(e.createdAt).format('DD/MM/YYYY'),
                    percent: e.state == SaleStates.canceled
                    ? <Chip label="Cancelado" icon="pi pi-times" className="bg-red-400 text-white text-xxs mt-0 mb-0 pt-0 pb-0 leading-none"/>
                    : <ProgressBar value={getPercentOfState(e.state)} className="progressBar" />
                        
                }))
                dispatch(setSales(response));
            }catch(e){
                removeToken();
                navigate('/');
            } 
            
        })();
    }, [dispatch, navigate]);

    const columns = [
        { isKey: true, order: false, field: 'id', header: 'ID '},
        { isKey: false, order: false, field: 'client.name', header: 'Cliente'},
        { isKey: false, order: false, field: 'percent', header: 'Estado'},
        { isKey: false, order: false, field: 'createdAtFormatted', header: 'Fecha De Inicio'},
        { isKey: false, order: false, field: 'totalFormatted', header: 'Total'},
    ]
    const handleRowClick = (event:DataTableRowClickEvent)=>{
        if (event.data && 'id' in event.data) {
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: true, modalHistorySale: event.data as IHistorySales}));
        }
    }
   const body = (<CreateNewSaleElement />);
       const createNewModal:CreateModalProps = (
               {
                   header: <h3>Nuevo (Presupuesto)</h3>,
                   body,
                   primaryButtonEvent: () => {},
                   resizable: false,
                   footer: <div></div>,
                   onHide: ()=>window.location.reload(),
                   onShow: ()=>cleanAdminToken()
               }
           )
    return <>
        <Table key={'comprobante'} data={comprobantes} columns={columns} placeholder="venta" onRowClick={handleRowClick} newModalContent={createNewModal} />
           {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
       </>
}        

