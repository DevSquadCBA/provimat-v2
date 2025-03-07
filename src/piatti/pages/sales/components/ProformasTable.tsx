import { useDispatch, useSelector } from "react-redux";
import { cleanAdminToken, setProformas } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { formatPrice} from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { Button } from "primereact/button";
import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces";
import { reducers } from "@/store";
import { changeVisibilityModalHistory, changeVisibilityModalModalProformaComprobante } from "@/reducers/modalsSlice";
import { ProformaToComprobanteModal } from "@/piatti/modals/sales/ProformaToComprobanteModal";
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement";
import { DataTableRowClickEvent } from "primereact/datatable";
import { SaleHistoryModal } from "../../clients/components/SaleHistoryModal";
import moment from "moment";
import { APIComponent } from "@/services/APIComponent";

export function ProformasTable() {
    const dispatch = useDispatch();
    const {proformas} = useSelector((state: reducers) => state.localData as unknown as {proformas: ISale[]});
    const {modalProformaToComprobanteVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalProformaToComprobanteVisible: boolean});
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const mappingFunction = (proformas:ISale[])=>proformas.map((e:ISale) =>({
        ...e,
        totalFormatted: '$'+ formatPrice(e.total || 0),
        createdAtFormatted: moment(e.createdAt).format('DD/MM/YYYY'),
        updateToComprobante: <Button className="updateToComprobante" size="small" onClick={
            () => {
                dispatch(changeVisibilityModalModalProformaComprobante({modalProformaToComprobanteVisible: true, idSaleForModals: e.id || 0}));
            }
        }>Actualizar a Comprobante</Button>
    }));

    const columns = [
        { isKey: true, order: false, field: 'id', header: 'ID '},
        { isKey: false, order: false, field: 'client.name', header: 'Cliente'},
        { isKey: false, order: false, field: 'updateToComprobante', header: 'Estado'},
        { isKey: false, order: false, field: 'createdAtFormatted', header: 'Fecha De Inicio'},
        { isKey: false, order: false, field: 'totalFormatted', header: 'Total'}
    ];
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
        {!proformas &&
            <APIComponent 
            callBack={API.Sale.get} 
            data={'proforma'} 
            mapping={mappingFunction}
            onSuccess={(data:ISale[])=>dispatch(setProformas(data))}
            />
        }
       <Table key={'Proforma'} data={proformas} columns={columns} placeholder="venta" onRowClick={handleRowClick} newModalContent={createNewModal}/>;
       {modalProformaToComprobanteVisible && <ProformaToComprobanteModal/>}
       {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
    </>
}