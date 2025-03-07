import { useDispatch, useSelector } from "react-redux";
import { cleanAdminToken, setPresupuestos} from "@/reducers/localDataReducer";
import API from "@/services/API";
import { formatPrice } from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { Button } from "primereact/button";
import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces";
import { reducers } from "@/store";
import { PresupuestoToProformaModal } from "@/piatti/modals/sales/PresupuestoToProformaModal";
import { changeVisibilityModalHistory, changeVisibilityModalPresupuestoToProforma } from "@/reducers/modalsSlice";
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement";
import { DataTableRowClickEvent } from "primereact/datatable";
import { SaleHistoryModal } from "../../clients/components/SaleHistoryModal";
import moment from "moment";
import { APIComponent } from "@/services/APIComponent";

export function PresupuestosTable() {
    const {modalPresupuestoToProformaVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalPresupuestoToProformaVisible: boolean});
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const dispatch = useDispatch();
    const {presupuestos} = useSelector((state: reducers) => state.localData as unknown as {presupuestos: ISale[]});
    const mappingFunction =(presupuestos:ISale[])=>presupuestos.map((e:ISale) =>({
        ...e, 
        totalFormatted: '$'+ formatPrice(e.total || 0),
        createdAtFormatted: moment(e.createdAt).format('DD/MM/YYYY'),
        updateToProforma: <Button className="updateToProforma" size="small" onClick={
            () => {
                 dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: true, idSaleForModals: e.id || 0}));
            }
        }>Actualizar a Proforma</Button>
    }));

    const columns = [
        { isKey: true, order: false, field: 'id', header: 'ID '},
        { isKey: false, order: false, field: 'client.name', header: 'Cliente'},
        { isKey: false, order: false, field: 'updateToProforma', header: 'Estado'},
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
    {!presupuestos && 
        <APIComponent 
            callBack={API.Sale.get} 
            data={'presupuesto'} 
            mapping={mappingFunction}
            onSuccess={(data:ISale[])=>dispatch(setPresupuestos(data))}
            />}
    <Table key={'presupuesto'} data={presupuestos} columns={columns} placeholder="venta" onRowClick={handleRowClick} newModalContent={createNewModal}/>
    {modalPresupuestoToProformaVisible && <PresupuestoToProformaModal/>}
    {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
    </>
}
