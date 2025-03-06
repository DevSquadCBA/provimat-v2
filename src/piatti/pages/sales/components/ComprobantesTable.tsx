import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSales } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { ISale } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { useNavigate } from "react-router-dom";
import { CreateModalProps } from "@/interfaces/interfaces";
import { CreateNewSaleElement } from "@/piatti/modals/creational/partial/CreateNewSaleElement";

interface RootState {
    localData: {
        sales: ISale[]
    }
}


export function ComprobantesTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const comprobantes = useSelector((state:RootState)=>state.localData.sales);

    useEffect(() => {
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Sale.get('comprobante',userData.token);
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
        { isKey: false, order: false, field: 'estimatedDays', header: 'Estado'},
        { isKey: false, order: false, field: 'createdAt', header: 'Fecha De Inicio'},
        { isKey: false, order: false, field: 'total', header: 'Total'},
    ]
   const body = (<CreateNewSaleElement />);
   const createNewModal:CreateModalProps = (
        {
            header: <h3>Nuevo (Presupuesto)</h3>,
            body,
            primaryButtonEvent: () => {},
            resizable: false,
            footer: <div></div>,
        }
    )
    return <Table key={'comprobante'} data={comprobantes} columns={columns} placeholder="venta" newModalContent={createNewModal} />;
}        

