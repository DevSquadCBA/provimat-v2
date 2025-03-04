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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface RootState {
    localData: {
        providers: IProvider[]
    }
}

export function ProvidersTable() {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const providers = useSelector((state:RootState)=>state.localData.providers);

    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                let response:IProvider[] = await API.Provider.all(userData.token);
                response = response.map((p:IProvider)=>({
                    ...p,
                    buttonsProviders: <Button>Editar</Button>}
                )); 
                dispatch(setProviders(response));
            }catch(e){
                removeToken();
                navigate('/');
            }
            
        })();
    }, [dispatch, navigate]);

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'cuit_cuil', header: 'CUIT/CUIL' },
        { isKey: false, order: false, field: 'daysDelays', header: 'Dias de retraso' },
        { isKey: false, order: false, field: 'buttonsProviders', header: '' }
    ]

    const createProviderHandler = (e: React.FormEvent)=>{
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
    }

    const body = (<form id="createProviderForm" className="modal-body" style={{maxWidth: "700px"}}>
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
    </form>)
    const createNewModal:CreateModalProps = (
        {
            header: <h2>Nuevo Proveedor</h2>,
            body,
            primaryButtonEvent: () => {},
            resizable: false,
            footer: <div>
            <Button rounded label="Crear" onClick={createProviderHandler} />
            </div>
        }
    )
    return <Table key={'providers'} data={providers} columns={columns}  placeholder="proveedor" newModalContent={createNewModal} />;
    
}