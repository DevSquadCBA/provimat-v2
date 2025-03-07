import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanAdminToken, setSales} from "@/reducers/localDataReducer";
import API from "@/services/API";
import { formatPrice, getUserData, removeToken } from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { CreateModalProps, IHistorySales } from "@/interfaces/interfaces";
import { reducers } from "@/store";
import { PresupuestoToProformaModal } from "@/piatti/modals/sales/PresupuestoToProformaModal";
import { changeVisibilityModalHistory, changeVisibilityModalPresupuestoToProforma } from "@/reducers/modalsSlice";
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement";
import { DataTableRowClickEvent } from "primereact/datatable";
import { SaleHistoryModal } from "../../clients/components/modal/SaleHistoryModal";
import moment from "moment";
import { ErrorResponse } from "@/interfaces/Errors";
import { showToast } from "@/reducers/toastSlice";

interface RootState {
    localData: {
        sales: ISale[]
    }
}

export function PresupuestosTable() {
    const {modalPresupuestoToProformaVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalPresupuestoToProformaVisible: boolean});
    const {modalHistoryVisible,modalHistorySale} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalHistoryVisible: boolean,modalHistorySale: null| IHistorySales, stateSelected: string});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const prespuestos = useSelector((state: RootState) => state.localData.sales);

    useEffect(() => {
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                let response:ISale[] = await API.Sale.get(userData.token,'presupuesto');
                response = response.map((e:ISale) =>({
                    ...e, 
                    totalFormatted: '$'+ formatPrice(e.total || 0),
                    createdAtFormatted: moment(e.createdAt).format('DD/MM/YYYY'),
                    updateToProforma: <Button className="updateToProforma" size="small" onClick={
                        () => {
                            dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: true, idSaleForModals: e.id || 0}));
                        }
                    }>Actualizar a Proforma</Button>
                }));

                dispatch(setSales(response));
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
    }, [dispatch, navigate]);

    const columns = [
        { isKey: true, order: false, field: 'id', header: 'ID '},
        { isKey: false, order: false, field: 'client.name', header: 'Cliente'},
        { isKey: false, order: false, field: 'updateToProforma', header: 'Estado'},
        { isKey: false, order: false, field: 'createdAtFormatted', header: 'Fecha De Inicio'},
        { isKey: false, order: false, field: 'totalFormatted', header: 'Total'}
    ];
    const handleRowClick = (event:DataTableRowClickEvent)=>{
        console.log(event);
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
    <Table key={'presupuesto'} data={prespuestos} columns={columns} placeholder="venta" onRowClick={handleRowClick} newModalContent={createNewModal}/>
    {modalPresupuestoToProformaVisible && <PresupuestoToProformaModal/>}
    {(modalHistoryVisible && <SaleHistoryModal sale={modalHistorySale!}></SaleHistoryModal>)}
    </>
}