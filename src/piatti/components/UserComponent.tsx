import { getUserData, removeToken } from "@/services/common";
import { Avatar } from "primereact/avatar"
import { ContextMenu } from "primereact/contextmenu";
import React from "react";

export function UserComponent(){
    const data = getUserData();
    const username = data?.username;
    const role = data?.role;
    const firstLetter = username?.charAt(0).toUpperCase();
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
            <Avatar label={firstLetter} onClick={(event) => cm.current && cm.current.show(event)}></Avatar>
            <div key="userName">{username}</div>
            <div key="role">{role}</div>
        </>
    )
}