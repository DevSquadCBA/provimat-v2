import { IHistorySales, TableColumns } from "@/interfaces/interfaces"
import { changeVisibility } from "@/reducers/modalsSlice";
import { reducers } from "@/store";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import { getWeightOfState} from "@/services/common";
import { SaleStates } from "@/interfaces/enums";
import '../style/SaleHistory.scss';
import { Table } from "@/piatti/components/Table";
import { Button } from "primereact/button";
import { StateSelector } from "@/piatti/components/StateSelector";

type Props = {
    sale: IHistorySales
}

export function SaleHistory({sale}:Props) {
    const dispatch = useDispatch();
    const {modalHistoryVisible,stateSelected} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const finishedSale = (<p><span className="text-important">Plazo de entrega:</span> {moment(sale.deadline?.toString()).format('DD/MM/YYYY')}</p>)
    const activeSale = (<div className="active-sale">
        <p className="delivery-date"><span className="text-important">Entregado:</span> {moment(sale.deadline?.toString()).format('DD/MM/YYYY')}</p>
        <p className="days-remaining"><span className="text-important">Días restantes:</span> {sale.estimatedDays?.toString()}</p>
    </div>)
    const headerElement = (
        <div className="modal-container">
            {sale.state == SaleStates.finished ? finishedSale : activeSale}           
            <div className="modal-state">
                <span className="text-important">Estado actual:</span>
                <StateSelector sale={sale}></StateSelector>
            </div>
            <div className="dummy"></div>
        </div>  
    );
    const footerElementTable = (
        <p className="modal-container">
            <span className="text-important big-text">Total:</span>
            <span className="text-important big-text" style={{color: 'var(--secondaryTextColor)'}}> {(sale.granTotal)}</span>
        </p>
    )
    const handleSaveButton = () => {
        const weight = getWeightOfState(sale.state || '');
        const newWeight = getWeightOfState(stateSelected || '');
        if(weight == 0){ //si es presupuesto
            console.log('Abrir modal de presupuesto a PROFORMA');
        }
        if(weight == 1 ) { // si es proforma
            console.log('Abrir modal de proforma a COMPROBANTE');
        }
        if(weight >= 2){ // si es comprobante o despues
            console.log('Permitir guardar el cambio de estado');
            console.log(newWeight);
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
        {footerElementTable}
        <p className="modal-footer">
            <Button onClick={handleSaveButton}>{getLabelOfButton()}</Button>
        </p>
        </div>
    )
    const columns:TableColumns[]= [
        { isKey: true,  order: false, field: 'code', header: 'Referencia' },
        { isKey: false,  order: false, field: 'name', header: 'Producto' },
        { isKey: false,  order: false, field: 'SaleProduct.details', header: 'Detalle' },
        { isKey: false,  order: false, field: 'SaleProduct.quantity', header: 'Cantidad' },
        { isKey: false,  order: false, field: 'salePrice', header: 'Precio', dataType: 'numeric' },
    ]
    const formattedProducts = sale.products.map((product) => ({...product,salePrice: (<span>{(product.salePrice)}</span>)}));
    return (
        <Dialog className="modal-history" header={headerElement} footer={footerElement}
             visible={modalHistoryVisible} 
             style={{ width: '50vw' }} 
             onHide={() => {if (!modalHistoryVisible) return; dispatch(changeVisibility({modalHistoryVisible: false,modalHistorySale:null})); }}>
            <Table columns={columns} data={formattedProducts} minimalQuantity={5}></Table>
        </Dialog>
    )
}