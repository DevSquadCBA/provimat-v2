import { useCallback, useEffect, useMemo, useRef, Ref } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setClients, setClientSelected, setSelectedFiscalCategory } from "@/reducers/localDataReducer";
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
import  pencil  from '../../../../assets/pencil.svg';
import { reducers } from "@/store";
import { APIComponent } from "@/services/APIComponent";

interface RootState {
    localData: {
        clients: IClient[]
    }
}

export function ClientsTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const clients = useSelector((state:RootState)=>state.localData.clients);
    const {selectedFiscalCategory} = useSelector((state:reducers)=>state.localData as unknown as {selectedFiscalCategory: FiscalCategory| null});
    const dropdownRef = useRef(null  as unknown); 
    const formRef = useRef(null as unknown);

    const handleClickEvent = (event: DataTableRowClickEvent) => {
        if (event.data && 'id' in event.data) {
            const clientId = event.data.id;
            navigate(`/clientes/historial/${clientId}`);
        }
    }

    const handleCategoryChange = useCallback((e: { value: keyof typeof FiscalCategoryValues }) => {
        dispatch(setSelectedFiscalCategory(e.value));
    }, [dispatch]);

    const createClientHandler = useCallback((e: React.FormEvent) => {
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
                
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            
            } catch (e) {
                removeToken();
                navigate('/');   
            }
        })()
    }, [clients, dispatch, navigate]);

    const updateClientHandler = (e: MouseEvent, idClient: number) => {
        const form = (document.getElementById('createClientForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form).entries());
        
        ( async () => {
            try {
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Client.update(userData.token,data, idClient);
                dispatch(setClients(clients.map(client => client.id === response.id ? response : client)));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Cliente actualizado", detail: "Se ha actualizado el cliente", life: 3000 }));
                
                setTimeout(() => {
                    window.location.reload();

                }, 500);

            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    }

    const deleteClientHandler = (id: number|undefined ) => {
        if (!id) return;
            ( async () => {
            try {
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Client.delete(userData.token,id);
                dispatch(setClients(clients.filter(client => client.id !== response.id)));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Cliente eliminado", detail: "Se ha eliminado el cliente", life: 3000 }));

                setTimeout(() => {
                    window.location.reload();

                }, 500);

            } catch (e) {
                removeToken();
                navigate('/');
            }
        })();       
    }

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'Id' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' , filter: 'Buscar por nombre'},
        { isKey: false, order: false, field: 'active', header: 'Presupuestos Activos' },
        { isKey: false, order: false, field: 'total', header: 'Nº de presupuestos' },
        { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' },
        { isKey: false, order: false, field: 'buttonsClients', header: '' },
    ]

    const body = useMemo(() => (
    <form id="createClientForm" ref={formRef as unknown as Ref<HTMLFormElement>} className="modal-body" style={{maxWidth: "700px"}}>
        <h3>Datos Requeridos</h3>
        <div className="flex flex_column gap_2 mt_3">
            <FloatLabel className="w-full">
                <InputText id="name" name="name" className="w-full" keyfilter={regexForText} required/>
                <label htmlFor="name">Nombre y Apellido</label>
            </FloatLabel>
            <div className="flex flex_row space-between">
                <Dropdown
                    id="fiscalCategory"
                    inputRef={dropdownRef as unknown as Ref<HTMLSelectElement> | undefined}
                    value={selectedFiscalCategory}
                    onChange={  handleCategoryChange}
                    name="fiscalCategory" 
                    options = { FiscalCategoryValues}
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
    </form>), [selectedFiscalCategory, handleCategoryChange]);

    const createNewModal:CreateModalProps =  useMemo(() =>({
            header: <h2>Nuevo Cliente</h2>,
             body,
            primaryButtonEvent: () => { },
            resizable: false,
            footer: <div>
            <Button rounded label="Crear" id="submitButton" onClick={createClientHandler} /> 
            </div>,
            onShow: ()=>dispatch(setSelectedFiscalCategory(null))
    }), [body, createClientHandler, dispatch]);


    const fillFieldWithCurrentClientAndEditModal = ( client: IClient ) => {
        const form: HTMLFormElement = formRef.current as unknown as HTMLFormElement;
        const elementName: HTMLInputElement = form['name'] as unknown as HTMLInputElement;
        elementName.value = client.name;
        form.fantasyName.value = client.fantasyName;
        form.dni.value = client.dni;
        form.email.value = client.email;
        form.whatsapp.value = client.whatsapp;
        form.phone.value = client.phone;
        form.province.value = client.province;
        form.localidad.value = client.localidad;
        form.address.value = client.address;
        dispatch(setSelectedFiscalCategory(client.fiscalCategory as keyof typeof FiscalCategoryValues));

        elementName.classList.add('p-filled');
        form.fantasyName.classList.add('p-filled');
        form.fiscalCategory.classList.add('p-filled');
        form.dni.classList.add('p-filled');
        form.email.classList.add('p-filled');
        form.whatsapp.classList.add('p-filled');
        form.phone.classList.add('p-filled');
        form.province.classList.add('p-filled');
        form.localidad.classList.add('p-filled');
        form.address.classList.add('p-filled');

        const button = document.querySelector('#submitButton') as HTMLButtonElement;
        if(button){
            const idClient = client.id as number;
            const newButtonUpdate = button.cloneNode(true) as HTMLButtonElement;
            newButtonUpdate.id = 'updateButton';
            newButtonUpdate.addEventListener('click', (e:MouseEvent) => updateClientHandler(e,idClient));
            newButtonUpdate.classList.add('p-button-secondary');
            const label = newButtonUpdate?.querySelector('.p-button-label');
            if(label){
                label.setAttribute('label', 'Actualizar');
                label.innerHTML = 'Actualizar';
            }
            button.parentNode?.replaceChild(newButtonUpdate, button);

            //add delete button
            const newButtonDelete = button.cloneNode(true) as HTMLButtonElement;
            newButtonDelete.id = 'deleteButton';
            newButtonDelete.addEventListener('click',() => deleteClientHandler(client.id));
            newButtonDelete.classList.add('p-button-danger');
            const labelDelete = newButtonDelete?.querySelector('.p-button-label');
            if(labelDelete){
                labelDelete.setAttribute('label', 'Eliminar');
                labelDelete.innerHTML = 'Eliminar';
            }
            newButtonUpdate.parentNode?.prepend(newButtonDelete);
        }
        const title = document.querySelector('p-dialog-title h2');
        if(title) title.innerHTML = 'Editar Cliente';
    }
    const mappingFunction = (clients: IClient[])=>clients.map((c) => ({
        ...c,
        buttonsClients: (
            <img src={pencil} onClick={(e) => {
                e.stopPropagation();
                dispatch(changeVisibilityModalCreation({modalCreationVisible: true }));
                setTimeout(() => {
                    fillFieldWithCurrentClientAndEditModal(c);
                }, 500);
            }}>
                
            </img>
        )

    }))
    useEffect(()=>{
        // para que cuando se seleccione un cliente, al volver y ver otro, este no se guarde
        dispatch(setClientSelected(null))
    })
    return <>
    {!clients &&
    <APIComponent 
        callBack={API.Client.all}
        mapping={mappingFunction}
        onSuccess={(data:IClient[])=>dispatch(setClients(data))}
        />
    }
    <Table 
        key={'clients'} 
        data={clients} 
        columns={columns} 
        placeholder="cliente" 
        onRowClick={handleClickEvent} 
        newModalContent={createNewModal} 
        />;
    </>
}