import { CreateModalProps, IHistorySales, TableColumns } from "@/interfaces/interfaces"
import { changeVisibilityModalHistory, changeVisibilityModalModalProformaComprobante, changeVisibilityModalPresupuestoToProforma } from "@/reducers/modalsSlice";
import { reducers } from "@/store";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import { getUserData, getWeightOfState, removeToken} from "@/services/common";
import { SaleStates } from "@/interfaces/enums";
import '../style/SaleHistory.scss';
import { Table } from "@/piatti/components/Table";
import { Button } from "primereact/button";
import { StateSelector } from "@/piatti/components/StateSelector";
import { ToPayTotal } from "@/piatti/components/ToPayTotal";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/services/API";
import { showToast } from "@/reducers/toastSlice";

type Props = {
    sale: IHistorySales
}

function getItemsByState(sale:IHistorySales){
    switch(sale.state){
        case SaleStates.presupuesto:
        case SaleStates.proforma:
            return (<p><span className="text-important">Fecha de creación:</span> {moment(sale.createdAt?.toString()).format('DD/MM/YYYY')}</p>)
        case SaleStates.finished:
            return (<p><span className="text-important">Entregado:</span> {moment(sale.deadline?.toString()).format('DD/MM/YYYY')}</p>);
        default: 
            return (<div className="active-sale">
                        <p className="delivery-date"><span className="text-important">Plazo de entrega:</span> {moment(sale.deadline?.toString()).format('DD/MM/YYYY')}</p>
                        <p className="days-remaining"><span className="text-important">Días restantes:</span> {sale.estimatedDays?.toString()}</p>
                    </div>);
    }
}

export function SaleHistoryModal({sale}:Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {modalHistoryVisible,stateSelected} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const dates = getItemsByState(sale);
    const montoAPagar = useRef(null as unknown as HTMLInputElement);
    const headerElement = (
        <div className="modal-container">
            {dates}        
            <div className="modal-state">
                <span className="text-important">Estado actual:</span>
                <StateSelector sale={sale}></StateSelector>
            </div>
            <div className="dummy"></div>
        </div>  
    );
    const footerElementTable = ()=>{
        if(sale.paid == sale.total || sale.state == SaleStates.presupuesto)
            return (
                <p className="modal-container">
                    <span className="text-important big-text">Total:</span>
                    <span className="text-important big-text" style={{color: 'var(--secondaryTextColor)'}}> {(sale.granTotal)}</span>
                </p>
            );
        else
            return (
                <ToPayTotal salesProducts={sale as {total: number, paid: number}} montoAPagar={montoAPagar}/>
            );
    }
    const handleSaveButton = () => {
        const weight = getWeightOfState(sale.state || '');
        const newWeight = getWeightOfState(stateSelected || '');
        if(weight == 0){ //si es presupuesto
            dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: true, idSaleForModals: sale.id as number}));
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: false, modalHistorySale: null}));
        }
        if(weight == 1 ) { // si es proforma
            dispatch(changeVisibilityModalModalProformaComprobante({modalProformaToComprobanteVisible: true, idSaleForModals: sale.id as number}));
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: false, modalHistorySale: null}));
        }
        if(weight >= 2){ // si es comprobante o despues
            console.log('Permitir guardar el cambio de estado');
            console.log(newWeight);
        }
    }
    const handleAddPaymentButton = async()=>{
        try{
            const monto = parseInt(montoAPagar.current.attributes.getNamedItem('aria-valuenow')?.value as unknown as string);
            const userData = getUserData();
            if (!userData || !userData.token) {
                removeToken();
                navigate('/');
                return;
            }
            const saleUpdated = await API.Sale.addPayment(sale.id,{paid: monto}, userData.token);
            const updatePaid = {...sale};
            updatePaid.paid = saleUpdated.paid;
            dispatch(changeVisibilityModalHistory({modalHistoryVisible: true, modalHistorySale: updatePaid}));
            dispatch(showToast({severity: 'success', summary: 'Pago agregado', detail: 'El pago se agrego correctamente'}));
        }catch(e){
            dispatch(showToast({severity: 'error', summary: 'Error', detail: 'Ocurrio un error al agregar el pago'}));
        }
    }
    const getLabelOfButton = () => {
        const weight = getWeightOfState(sale.state || '');
        if(weight == 0){ //si es presupuesto
            return 'Pasar a Proforma';
        }
        if(weight == 1 ) { // si es proforma
            return 'Pasar a Comprobante';
        }
        if(weight >= 2){ // si es comprobante o despues
            return 'Guardar Cambios';
        }
    }
    const footerElement = (<div>
        {footerElementTable()}
        <p className="modal-footer">
            {sale.paid != sale.total &&
            <Button rounded onClick={handleAddPaymentButton}>Agregar un pago</Button>
            }
            <Button rounded onClick={handleSaveButton}>{getLabelOfButton()}</Button>
        </p>
        </div>
    )
    const columns:TableColumns[]= [
        { isKey: true,  order: false, field: 'code', header: 'Referencia' },
        { isKey: false,  order: false, field: 'name', header: 'Producto' },
        { isKey: false,  order: false, field: 'saleProduct.details', header: 'Detalle' },
        { isKey: false,  order: false, field: 'saleProduct.quantity', header: 'Cantidad' },
        { isKey: false,  order: false, field: 'salePrice', header: 'Precio', dataType: 'numeric' },
    ]
    const formattedProducts = sale.products.map((product) => ({...product,salePrice: (<span>$ {(product.salePrice)}</span>)}));
    const createNewModal:CreateModalProps = (
        {
            body: <></>,
            header: <></>,
            primaryButtonEvent: () => {},
            footer: <></>
        }
    )
    return (
        <>
            <Dialog className="modal-history" header={headerElement} footer={footerElement}
                visible={modalHistoryVisible} 
                style={{ width: '50vw' }} 
                onHide={() => {if (!modalHistoryVisible) return; dispatch(changeVisibilityModalHistory({modalHistoryVisible: false,modalHistorySale:null})); }}>
                <Table columns={columns} data={formattedProducts} minimalQuantity={5} newModalContent={createNewModal}></Table>
            </Dialog>
        </>
    )
}