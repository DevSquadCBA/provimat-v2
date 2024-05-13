/* eslint-disable  @typescript-eslint/no-explicit-any */
import { HeaderTable } from "@/piatti/components/HeaderTable";
import { Sidebar } from "../components/Sidebar";
import { Children, ReactNode } from "react";

type Props = {
    children: ReactNode;
}

export function LayoutContainerTable({children}:Props) {

    const table = Children.toArray(children).find((child:any)=>child.type && (child.type as any).name.includes("Table"));
    
    return(
    <div className="layout-container">
            <Sidebar/>
        <div className="content">
            {/* @TODO: agregar el contenido */}
            <div className="header">
                <HeaderTable />
            </div>
            <div className="view">
                {table}
            </div>
        </div>
    </div>
    )
}