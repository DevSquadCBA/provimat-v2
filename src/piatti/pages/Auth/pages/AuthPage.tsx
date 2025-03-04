import "./AuthPage.scss"
import SIP_main  from '@/assets/SIP_main.svg';
import logo from '@/assets/Piatti_puerta_logo.svg';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import {  useState } from "react";
import API from "@/services/API";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import { setToken } from "@/services/common";
export function AuthPage() {
    const [loginSended, setLoginSended] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [wrongCredentials, setWrongCredentials] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async ()=>{
        setLoginSended(true);
        try{
            const token = await API.Auth.login({username, password });
            setToken(token);
            navigate("/clientes");          
            setLoginSended(false);
            setWrongCredentials(false);
        }catch(e:unknown){
            console.log(e);
            setLoginSended(false);
            setWrongCredentials(true);
        }

    }
    return <>
        <div className="container">
            <div className="background">
                <img src={SIP_main} className="background-image" alt="background" />
            </div>
                <div className="form">
                    <div className="form-container">
                        <img src={logo} className="logo" alt="logo" />
                        <div className="form-input-group">
                            <span className="p-input-icon-left">
                                <i className="pi pi-user" />
                                <InputText id="username" className="p-inputtext" placeholder="Usuario" onChange={(e)=>{
                                    setWrongCredentials(false);
                                    setUsername(e.target.value)
                                    }}/>  
                            </span>
                            <span className="p-input-icon-left">
                                <i className="pi pi-key" />
                                <InputText id="password" type="password" className="p-inputtext" placeholder="Contraseña" onChange={(e)=>{
                                    setWrongCredentials(false);
                                    setPassword(e.target.value)
                                    }}/>  
                            </span>
                            <div className="button-container">
                                {wrongCredentials &&
                                <Message severity="error" text="Credenciales incorrectas" />
                                }
                                <Button onClick={handleLogin}>
                                    {loginSended ? "Cargando..." : "Iniciar sesión"}
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </>
}