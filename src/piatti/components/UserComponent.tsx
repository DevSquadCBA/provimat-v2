import { getUserData, removeToken } from "@/services/common";
import { Avatar } from "primereact/avatar"
import { ContextMenu } from "primereact/contextmenu";
import React from "react";

export function UserComponent(){
    const getTwoLettersFromName = (name:string)=>{
        const names = name.split(' ');
        if(name.length > 1){
            return names[0].charAt(0).toUpperCase() + names[1].charAt(0).toUpperCase();
        }else{
            return name.charAt(0).toUpperCase();
        }
    }
    const getPermissionsColor = (permission:string) =>{
        switch(permission){
            case 'Administrador':
                return '#e85300';
            case 'Supervisor':
                return '#0d3831';
            case 'Vendedor':
                return '#4CB3A0';
            default:
                return 'bg-gray-500';
        }
    }
    const data = getUserData();
    const username = data?.username;
    const role = data?.role;
    const firstLetter = getTwoLettersFromName(username || '');
    const cm = React.useRef(null as unknown as ContextMenu);

    const items = [
        {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
                removeToken();
                window.location.href = '/';
            }
        }
    ]
    return (
        <>  
            <ContextMenu model={items} ref={cm} breakpoint="767px" />
            <div className="flex" onClick={(event) => cm.current && cm.current.show(event)}>
                <Avatar label={firstLetter} shape="circle" size="large" style={{ backgroundColor: getPermissionsColor(role || ''), color: "white" }}></Avatar>
                <div className="flex flex-column ml-3">
                    <div key="userName" className="font-bold text-lg " style={{color: getPermissionsColor(role || ''), textOverflow:'ellipsis', whiteSpace:'nowrap', overflow:'hidden', maxWidth: '15rem'}}>{username}</div>
                    <div key="role">{role}</div>
                </div>
            </div>
        </>
    )
}