import { IUser } from "@/interfaces/dbModels";
import { Role, RoleData } from "@/interfaces/enums";
import { CreateModalProps } from "@/interfaces/interfaces";
import { Table } from "@/piatti/components/Table";
import { setTeam, setSelectedRole } from '@/reducers/localDataReducer';
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { getUserData, regexForText, removeToken } from "@/services/common";
import { reducers } from "@/store";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import  pencil  from '../../../../assets/pencil.svg';
import { ErrorResponse } from "@/interfaces/Errors";


/*
            const role = decodeJWTToken(adminToken).role;
            if(hasDiscount && role !== Role.ADMIN && role !== Role.SUPERVISOR){
                dispatch(showToast({severity: 'error', summary: 'Error', detail: 'No tienes permiso para aplicar descuentos con ese usuario logueado'}));
                return;
            }
*/

interface RootState {
    localData: {
        team: IUser[]
    }
}

export function TeamTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dropdownRef = useRef(null  as unknown); 
    const formRef = useRef(null as unknown);
    const team = useSelector((state:RootState)=>state.localData.team);
    const {selectedRole} = useSelector((state:reducers) => state.localData as unknown as {selectedRole: Role| null });
    const [pass, setPass] = useState('');
    
    const handleTeamChange = useCallback((e: {value: number}) => {
        dispatch(setSelectedRole(e.value))
    }, [dispatch]);

    const createTeamHandler = useCallback((e: React.FormEvent) => {
        const form = (document.getElementById('createTeamForm') as HTMLFormElement);
        e.preventDefault();
        if(!form.reportValidity()) return;
        const data = Object.fromEntries(
            new FormData(form).entries()
        ) as unknown as IUser;

        if(!data) {
            dispatch(showToast({ severity: "error", summary: "Error", detail: "Los campos de usuario estan vacios", life: 3000 }));
            return;
        }

        (
            async() => {
                try {
                    const userData = getUserData();
                    if (!userData ||!userData.token) {
                        removeToken();
                        navigate('/');
                        return;
                    }
                    
                    const response = await API.User.create(userData.token,data);
                    dispatch(setTeam([...team,response]));
                    dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                    dispatch(showToast({ severity: "success", summary: "Usuario creado", detail: "Se ha creado el nuevo usuario", life: 3000 }));
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                
                } catch (e) {
                    if(e instanceof ErrorResponse) {
                        dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                        if(e.getCode() === 401){
                            removeToken();
                            navigate('/');
                        }
                    }else{
                        dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudo crear el usuario", life: 3000 }));
                    }
                    console.error(e);
                    
                }
            })()    
    }, [team, dispatch, navigate]);

    const updateTeamHandler = (e: MouseEvent, idUser: number) => {
        const form = (document.getElementById('createTeamForm') as HTMLFormElement);
        e.preventDefault();
        if(!form.reportValidity()) return;
        const data = Object.fromEntries(
            new FormData(form).entries());
        
        (async () => {
            try {
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                console.log(data)
                await API.User.update(userData.token,data, idUser);
                //dispatch(setTeam(team.map(user => user.id === response.id ? response : user)));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Usuario actualizado", detail: "Se ha actualizado el usuario", life: 3000 }));
            } catch (e) {
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener los usuarios", life: 3000 }));
                }
                console.error(e);
            }
        })();
    } 

    const deleteTeamHandler =  (id: number|undefined ) => {
        if (!id) return;
        ( async () => {
            try {
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                await API.User.delete(userData.token,id);
                //dispatch(setTeam(team.filter(user => user.id !== response.id)));
                dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
                dispatch(showToast({ severity: "success", summary: "Usuario eliminado", detail: "Se ha eliminado el usuario", life: 3000 }));
           
                setTimeout(() => {
                    window.location.reload();
                })

            } catch (e) {
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudo eliminar el usuario", life: 3000 }));
                }
                console.error(e);
            }
        })();
        
    }
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'email', header: 'Email' },
        { isKey: false, order: false, field: 'role.name', header: 'Rol' },
        { isKey: false, order: false, field: 'buttonsUsers', header: '' },
    ];

    const body = useMemo(() => (
        <form id="createTeamForm" ref={formRef as unknown as Ref<HTMLFormElement>} className="modal-body" style={{maxWidth: "700px"}} >
            <h3>Datos Requeridos</h3>
            <div className="flex flex_column gap_2 mt_2">
                <div className="flex flex_row space-between">
                    <FloatLabel>
                        <InputText id="name" name="name" className="w-full" keyfilter={regexForText} required/>
                        <label htmlFor="name">Nombre y Apellido</label>
                    </FloatLabel>
                    <Dropdown
                        id="roleId"
                        inputRef={dropdownRef as unknown as Ref<HTMLSelectElement> | undefined}
                        value={selectedRole}
                        onChange={  handleTeamChange}
                        name="roleId" 
                        options = {Object.values(RoleData)}
                        optionLabel="name"  
                        optionValue="id" 
                        className="w-fit mt_2"
                            editable placeholder="Seleccione Rol"
                        required
                    />
                </div>
            </div>
            <h3>Datos de Contacto</h3>
            <div className="flex flex_column gap_2 mt_2">
                <div className="flex flex_row space-between">
                    <FloatLabel>
                        <InputText id ="whatsapp" name="whatsapp" keyfilter={/^[+]?([0-9]{1,12})?$/}  />
                        <label htmlFor="whatsapp">Whatsapp</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="address" name="address" className="w-full"/>
                        <label htmlFor="address">Direccion</label>
                    </FloatLabel>
                </div>
            </div>
            <h3>Datos de Inicio De Sesión</h3>
            <div className="flex flex_column gap_2 mt_2">
                <div className="flex flex_row space-between">
                    <FloatLabel>
                        <InputText id="email" name="email" keyfilter="email" />
                        <label htmlFor="email">Email</label>
                    </FloatLabel>
                    <FloatLabel>
                        <Password
                            id="password" 
                            name="password"
                            inputId="password" 
                            value={pass} onChange={(e) => setPass(e.target.value)}
                        />
                        <label htmlFor="address">Contraseña</label>
                    </FloatLabel>
                </div>
            </div>

        </form>), [selectedRole, handleTeamChange, pass])
    
    const createNewModal:CreateModalProps =  useMemo(() =>({
            header: <h2>Nuevo Usuario</h2>,
            body,
            primaryButtonEvent: () => {},
            resizable: false,
            footer: <div>
            <Button rounded label="Crear" id="submitButton" onClick={createTeamHandler}></Button>
            </div>,
            onShow: () => dispatch(setSelectedRole(null)),
    }), [body, createTeamHandler, dispatch]);

    const fillFieldWithCurentUserAndEditModal = ( user: IUser ) => {
        const form: HTMLFormElement = formRef.current as unknown as HTMLFormElement;
        const elementName: HTMLInputElement = form['name'] as unknown as HTMLInputElement;
        elementName.value = user.name;
        form.email.value = user.email;
        form.whatsapp.value = user.whatsapp;
        form.address.value = user.address;
        //form.roleId.value = user.role.id as string;
        dispatch(setSelectedRole(user.role.id as number));

        elementName.classList.add('p-filled');
        form.email.classList.add('p-filled');
        form.whatsapp.classList.add('p-filled');
        form.address.classList.add('p-filled');

        const button = document.querySelector('#submitButton') as HTMLButtonElement;
        if(button){
            const idUser = user.id as number;
            const newButtonUpdate = button.cloneNode(true) as HTMLButtonElement;
            newButtonUpdate.id = 'updateButton';
            newButtonUpdate.addEventListener('click',(e: MouseEvent) => updateTeamHandler(e, idUser));
            newButtonUpdate.classList.add('p-button-secondary');
            const label = newButtonUpdate?.querySelector('.p-button-label');
            if(label){
              label.setAttribute('label', 'Actualizar');
              label.innerHTML = 'Actualizar';
            }
            button.parentNode?.replaceChild(newButtonUpdate, button);

            const newButtonDelete = button.cloneNode(true) as HTMLButtonElement;
            newButtonDelete.id = 'deleteButton';
            newButtonDelete.addEventListener('click',() => deleteTeamHandler(idUser));
            newButtonDelete.classList.add('p-button-danger');
            const labelDelete = newButtonDelete?.querySelector('.p-button-label');
            if(labelDelete){
              labelDelete.setAttribute('label', 'Eliminar');
              labelDelete.innerHTML = 'Eliminar';
            }
            newButtonUpdate.parentNode?.prepend(newButtonDelete);
        }
        const title = document.querySelector('p-dialog-title h2');
        if(title) title.innerHTML = 'Editar Usuario';
    }

    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                let response: IUser[] = await API.User.all(userData.token);
                response = response.map(user => ({
                    ...user,
                buttonsUsers:(
                    <img src={pencil} onClick={() => {
                        dispatch(changeVisibilityModalCreation({modalCreationVisible: true}));
                        setTimeout(() => {
                            fillFieldWithCurentUserAndEditModal(user);
                        }, 500);
                    }}>

                    </img>
                ) 
            }))
                dispatch(setTeam(response));
            }catch(e){
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener los usuarios", life: 3000 }));
                }
                console.error(e);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Table 
    key={'team'} 
    data={team} 
    columns={columns} 
    placeholder="usuario" 
    newModalContent={createNewModal}
    />;
}