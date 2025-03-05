import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setClients } from "@/reducers/localDataReducer";
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { IClient } from '@/interfaces/dbModels';
import { Table } from '@/piatti/components/Table';
import { DataTableRowClickEvent } from "primereact/datatable";
import { getUserData, regexForText, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";
import { CreateModalProps } from "@/interfaces/interfaces";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FiscalCategory, FiscalCategoryValues } from "@/interfaces/enums";

interface RootState {
    localData: {
        clients: IClient[]
    }
}


export function ClientsTable() {
    const navigate = useNavigate();
    const handleClickEvent = (event: DataTableRowClickEvent) => {
        if (event.data && 'id' in event.data) {
            const clientId = event.data.id;
            navigate(`/clientes/historial/${clientId}`);
        }
    }
    const dispatch = useDispatch();
    const clients = useSelector((state:RootState)=>state.localData.clients);

    const [selectedFiscalCategory, setSelectedFiscalCategory] = useState<FiscalCategory | null>(null);

    const handleCategoryChange = useCallback ((e: { value: FiscalCategory }) => {
        setSelectedFiscalCategory(e.value);
    }, []);
    
    const createProductHandler = useCallback((e: React.FormEvent) => {
        const form = (document.getElementById('createClientForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(
            new FormData(form).entries()
        ) as unknown as IClient;
        if(!data){
            dispatch(showToast({ severity: "error", summary: "Error", detail: "Los campos de cliente estan vacios", life: 3000 }));
            return;
        }
        
        ( async () => {
            try {
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }

                const response = await API.Client.create(userData.token,data);
                dispatch(setClients([...clients,response]));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Cliente creado", detail: "Se ha creado el nuevo cliente", life: 3000 }));
            } catch (e) {
                removeToken();
                navigate('/');   
            }
        })()
    }, [clients, dispatch, navigate]);  
    
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'Id' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, order: false, field: 'active', header: 'Presupuestos Activos' },
        { isKey: false, order: false, field: 'total', header: 'Nº de presupuestos' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]

    const body = useMemo(() => (<form id="createClientForm" className="modal-body" style={{maxWidth: "700px"}}>
        <h3>Datos Requeridos</h3>
        <div className="flex flex_column gap_2 mt_3">
            <FloatLabel className="w-full">
                <InputText id="name" name="name" className="w-full" keyfilter={regexForText} required/>
                <label htmlFor="name">Nombre y Apellido</label>
            </FloatLabel>
            <div className="flex flex_row space-between">
                <Dropdown
                    name="taxType" 
                    options = { FiscalCategoryValues}
                    onChange={  handleCategoryChange}
                    value={selectedFiscalCategory}
                    className="w-fit mt_1"
                     editable placeholder="Seleccione Categoría Fiscal"
                    required
                />
                <FloatLabel>
                    <InputText id="dni" keyfilter="int" name="dni" required />
                    <label htmlFor="dni">Dni/Cuit/Cuil</label>
                </FloatLabel>
            </div>
        </div>
        <h3>Información Adicional</h3>
        <div className="flex flex_column gap_2 mt_2">
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="fantasyName" name="fantasyName" keyfilter={regexForText}/>
                    <label htmlFor="fantasyName">Nombre de Fantasía</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="email" name="email" keyfilter="email" />
                    <label htmlFor="email">Email</label>
                </FloatLabel>
            </div>
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id ="whatsapp" name="whatsapp" keyfilter={/^[+]?([0-9]{1,12})?$/}  />
                    <label htmlFor="whatsapp">Whatsapp</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText keyfilter="int" id="phone" name="phone"/>
                    <label htmlFor="phone">Celular</label>               
                </FloatLabel>
            </div>
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="province" name="province" keyfilter={regexForText} />
                    <label htmlFor="province">Provincia</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="localidad" name="localidad" keyfilter={regexForText}/>
                    <label htmlFor="localidad">Localidad</label>
                </FloatLabel>
            </div>
            <FloatLabel className="w-full">
                <InputText id="address" name="address" className="w-full"/>
                <label htmlFor="address">Direccion</label>
            </FloatLabel>
        </div>
    </form>), [selectedFiscalCategory, handleCategoryChange,]);

    const createNewModal:CreateModalProps =  useMemo(() =>({
            header: <h2>Nuevo Cliente</h2>,
             body,
            primaryButtonEvent: () => {},
            resizable: false,
            footer: <div>
            <Button rounded label="Crear" id="submitButton" onClick={createProductHandler} /> 
            </div>
    }), [body, createProductHandler]);

    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Client.all(userData.token);
                dispatch(setClients(response));
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    }, [dispatch,navigate]);


    return <Table key={'clients'} data={clients} columns={columns} placeholder="cliente" onRowClick={handleClickEvent} newModalContent={createNewModal}/>;
}