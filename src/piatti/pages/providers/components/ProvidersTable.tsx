import { IProvider } from "@/interfaces/dbModels";
import { CreateModalProps } from "@/interfaces/interfaces";
import { Table } from "@/piatti/components/Table";
import { setProviders } from "@/reducers/localDataReducer";
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import  pencil  from '../../../../assets/pencil.svg';


interface RootState {
    localData: {
        providers: IProvider[]
    }
}

export function ProvidersTable() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const providers = useSelector((state:RootState)=>state.localData.providers);

    const createProviderHandler = useCallback((e: React.FormEvent)=>{
        // obtiene los datos del formulario y los envía al backend
        const form = (document.getElementById('createProviderForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(
            new FormData(form).entries()
        );
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Provider.create(userData.token,data);
                dispatch(setProviders([...providers, response]));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Proveedor creado", detail: "Se ha creado el nuevo proveedor", life: 3000 }));
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    },[dispatch, navigate, providers])
    const updateProviderHandle = (e: MouseEvent, idProvider: number) => {
            const form = document.getElementById('createProviderForm') as HTMLFormElement;
            e.preventDefault();
            if (!form.reportValidity()) return;
            const data = Object.fromEntries(new FormData(form).entries());
    
            (async () => {
                try {
                    const userData = getUserData();
                    if (!userData || !userData.token) {
                        removeToken();
                        navigate('/');
                        return;
                    }
                    console.log(data);
                    const response = await API.Provider.update(userData.token, data, idProvider);
                    dispatch(setProviders(providers.map((provider) => provider.id === response.id ? response : provider)));
                    dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
                    dispatch(showToast({ severity: "success", summary: "Proveedor actualizado", detail: "Se ha actualizado el proveedor", life: 3000 }));
                } catch (e) {
                    removeToken();
                    navigate('/');
                }
            })();
    }
    const deleteProviderHandle = (id:number|undefined) => {
            if (!id) return;
            (async () => {
                try {
                    const userData = getUserData();
                    if (!userData || !userData.token) {
                        removeToken();
                        navigate('/');
                        return;
                    }
                    const response = await API.Provider.delete(userData.token, id);
                    dispatch(setProviders(providers.filter((provider) => provider.id !== response.id)));
                    dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
                    dispatch(showToast({ severity: "success", summary: "Proveedor eliminado", detail: "Se ha eliminado el proveedor", life: 3000 }));
                } catch (e) {
                    removeToken();
                    navigate('/');
                }
            })();
    }
    const body = useMemo(()=>(<form id="createProviderForm" className="modal-body" style={{maxWidth: "700px"}}>
        <h3>Datos Requeridos</h3>
        <div className="flex flex_column gap_2 mt_2">
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="name" name="name" required/>
                    <label htmlFor="name">Nombre</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="daysDelays" name="daysDelays" required keyfilter={'int'}/>
                    <label htmlFor="daysDelays">Días de demora habitual</label>
                </FloatLabel>
            </div>
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="fantasyName" name="fantasyName" required/>
                    <label htmlFor="fantasyName">Nombre Fantasía</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="cuit_cuil" name="cuit_cuil" required keyfilter={/^[0-9]*-*$/}/>
                    <label htmlFor="cuit_cuil">Cuit/Cuil</label>
                </FloatLabel>
            </div>
        </div>
        <h3>Información Adicional</h3>
        <div className="flex flex_column gap_2 mt_2">
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="phone" name="phone"/>
                    <label htmlFor="phone">Teléfono</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="email" name="email" />
                    <label htmlFor="email">Email</label>
                </FloatLabel>
            </div>
            <div style={{ padding: "0 0"}}>
                <FloatLabel>
                    <InputText id="address" name="address" />
                    <label htmlFor="address">Dirección</label>
                </FloatLabel>
            </div>
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="province" name="province" />
                    <label htmlFor="province">Provincia</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="locality" name="locality" />
                    <label htmlFor="locality">Localidad</label>
                </FloatLabel>
            </div>
        </div>
    </form>),[]);
    const createNewModal: CreateModalProps = useMemo(() => ({
        header: <h2>Nuevo Proveedor</h2>,
        body,
        primaryButtonEvent: () => {},
        resizable: false,
        footer: <div>
            <Button rounded label="Crear" id="submitButton" onClick={createProviderHandler} />
        </div>
    }), [body, createProviderHandler]); 

    const fillFieldsWithCurrentProviderAndEditModal = (provider: IProvider) => {
        const form = (document.getElementById('createProviderForm') as HTMLFormElement);
        // esto de elementName, es porque form.name me dice que trae el nombre del formulario, pero es error de Typescript.
        const elementName: HTMLInputElement = form['name'] as unknown as HTMLInputElement;
        elementName.value= provider.name;
        form.fantasyName.value = provider.fantasyName;
        form.cuit_cuil.value = provider.cuit_cuil;
        form.daysDelays.value = provider.daysDelays.toString();
        form.phone.value = provider.phone;
        form.email.value = provider.email;
        form.address.value = provider.address;
        form.province.value = provider.province;
        form.locality.value = provider.locality;

        elementName.classList.add('p-filled');
        form.fantasyName.classList.add('p-filled');
        form.cuit_cuil.classList.add('p-filled');
        form.daysDelays.classList.add('p-filled');
        form.phone.classList.add('p-filled');
        form.email.classList.add('p-filled');
        form.address.classList.add('p-filled');
        form.province.classList.add('p-filled');
        form.locality.classList.add('p-filled');
        const button = document.querySelector('#submitButton') as HTMLButtonElement;
        if(button){
            // create updateButton
            const idProvider = provider.id as number;
            const newButtonUpdate = button.cloneNode(true) as HTMLButtonElement;
            newButtonUpdate.id = 'updateButton';
            newButtonUpdate.addEventListener('click', (e:MouseEvent) =>updateProviderHandle(e, idProvider));
            newButtonUpdate.classList.add('p-button-secondary');
            const label = newButtonUpdate?.querySelector('.p-button-label');
            if(label) {
                label.setAttribute('label', 'Actualizar');
                label.innerHTML = 'Actualizar';
            }
            button.parentNode?.replaceChild(newButtonUpdate, button);
            // add deletebutton
            const newButtonDelete = button.cloneNode(true) as HTMLButtonElement;
            newButtonDelete.id = 'deleteButton';
            newButtonDelete.addEventListener('click', ()=>deleteProviderHandle(provider.id));
            const labelDelete = newButtonDelete?.querySelector('.p-button-label')
            if(labelDelete){
                labelDelete?.setAttribute('label', 'Eliminar');
                labelDelete.innerHTML = 'Eliminar';
            }
            newButtonUpdate.parentNode?.prepend(newButtonDelete);
        }
        const title = document.querySelector('.p-dialog-title h2');
        if(title) title.innerHTML = 'Editar Proveedor';
    }
    useEffect(() => {
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                let response: IProvider[] = await API.Provider.all(userData.token);
                response = response.map((p) => ({
                    ...p,
                    buttonsProviders: (
                        <img src={pencil} onClick={(e) => {
                            e.stopPropagation();
                            dispatch(changeVisibilityModalCreation({ modalCreationVisible: true }));
                            setTimeout(() => {
                                fillFieldsWithCurrentProviderAndEditModal(p);
                            },200)
                        }}>
                            
                        </img>
                    )
                }));
                dispatch(setProviders(response));
            } catch (e) {
                removeToken();
                navigate('/');
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'cuit_cuil', header: 'CUIT/CUIL' },
        { isKey: false, order: false, field: 'daysDelays', header: 'Dias de retraso' },
        { isKey: false, order: false, field: 'buttonsProviders', header: '' }
    ]

    return <Table key={'providers'} data={providers} columns={columns} placeholder="proveedor" newModalContent={createNewModal} />;
    
}