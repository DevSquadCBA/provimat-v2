/* eslint-disable  @typescript-eslint/no-explicit-any */
import './LayoutContainerTable.scss';
import { Sidebar } from "../components/Sidebar";
import { UserComponent } from '../components/UserComponent';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode
}
export function LayoutContainer({children}:Props) {

    return(
    <div className="layout-container">
            <Sidebar/>
        <div className="content">
            {/* @TODO: agregar el contenido */}
            <div className="header">
                <div className="header-table">
                    <div className="user-content ">
                        <UserComponent/>
                    </div>
                </div>
            </div>
            <div className="view">
                {children}
            </div>
        </div>
    </div>
    )
}