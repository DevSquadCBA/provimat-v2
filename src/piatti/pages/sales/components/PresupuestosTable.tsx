import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSales } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { CreateModalProps } from "@/interfaces/interfaces";
import { reducers } from "@/store";
import { PresupuestoToProformaModal } from "@/piatti/modals/sales/PresupuestoToProformaModal";
import { changeVisibilityModalPresupuestoToProforma } from "@/reducers/modalsSlice";
interface RootState {
    localData: {
        sales: ISale[]
    }
}


export function PresupuestosTable() {
    const {modalPresupuestoToProformaVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalPresupuestoToProformaVisible: boolean});
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
                    let response:ISale[] = await API.Sale.get('presupuesto',userData.token);
                    response = response.map((e:ISale) =>({
                        ...e, 
                        updateToProforma: <Button className="updateToProforma" size="small" onClick={
                            () => {
                                dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: true, idSaleForModals: e.id || 0}));
                            }
                        }>Actualizar a Proforma</Button>
                    }));

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
            { isKey: false, order: false, field: 'updateToProforma', header: 'Estado'},
            { isKey: false, order: false, field: 'createdAt', header: 'Fecha De Inicio'},
            { isKey: false, order: false, field: 'total', header: 'Total'}
        ];
    const createNewModal:CreateModalProps = (
            {
                header: <h2>Nuevo Proveedor</h2>,
                body: <></>,
                primaryButtonEvent: () => {},
                resizable: false,
                footer: <div></div>
            }
        )
    return <>
    <Table key={'presupuesto'} data={prespuestos} columns={columns} placeholder="venta" newModalContent={createNewModal}/>;
    {modalPresupuestoToProformaVisible && <PresupuestoToProformaModal/>}
    </>
}