import { Role } from "@/interfaces/enums";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { decodeJWTToken } from "@/services/common";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dispatch, SetStateAction, useRef } from "react";
import { useDispatch } from "react-redux";

type Props ={
    accept: (token:string) => void;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}
export function LoginByAdminModal({accept, visible, setVisible}:Props) {
    const dispatch = useDispatch();
    const usernameField = useRef(null as unknown as HTMLInputElement);
    const passwordField = useRef(null as unknown as HTMLInputElement);
    const login = async () =>{
        try{
            const username = usernameField.current.value;
            const password = passwordField.current.value;
            const token = await API.Auth.login({username: username, password: password});
            const role = decodeJWTToken(token).role;
            if(role === Role.ADMIN || role === Role.SUPERVISOR){
                dispatch(showToast({severity: 'success', summary: 'Acceso', detail: 'Logueado con cuenta con permisos'}));
                accept(token);
            }else{
                dispatch(showToast({severity: 'error', summary: 'Error', detail: 'El logueado no tiene permiso para aplicar descuentos'}));
                usernameField.current.value = '';
                passwordField.current.value = '';
            }
        }catch(e){
            dispatch(showToast({severity: 'error', summary: 'Error', detail: 'Ocurrio un error al loguearse'}));
         }
    }
    const content = (
        <div className="login-dialog-modal">
            <div className="dialog-container flex align-items-center flex_column">
                <span className="login-dialog-message">Necesita autorización para aplicar descuentos</span>
                <div className="input-container flex flex_column w-7">
                    <IconField iconPosition="left" className="w-full">
                        <InputIcon className="pi pi-user"/>
                        <InputText ref={usernameField} id="username" placeholder={''} className="w-full" />
                    </IconField>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-key" />
                        <InputText ref={passwordField} id="password" placeholder={''} type="password" className="w-full" />
                    </IconField>
                </div>
                <div className="buttons-container flex flex_rows w-7 space-around">
                    <Button className="accept" onClick={login}>Guardar</Button>
                    <Button className="cancel" onClick={()=>setVisible(false)}>Cancelar</Button>
                </div>
            </div>
        </div>
    )
   return <ConfirmDialog
        group="headless"
        visible={visible}
        content={content}
        onHide={() => setVisible(false)}
    />
}

/*
onHide={()=>setVisible(false)}
        message={message}
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        style={{ width: '50vw' }}
        breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
        */