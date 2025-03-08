/* eslint-disable  @typescript-eslint/no-explicit-any */
import {HeaderHistory} from "@/piatti/components/HeaderHistory";
import { Sidebar } from "../components/Sidebar";
import "./LayoutContainerTable.scss";
import { Children, ReactNode } from "react";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { UserData } from "../pages/clients/components/partial/UserData";

type Props = {
    children: ReactNode;
    historyComponents: ReactNode;
    clientData:ClientWithBudgetData|undefined
}


export function LayoutContainerHistory({children,historyComponents, clientData}:Props) {
    const history = Children.toArray(children).find((child:any)=>child.type && (child.type as any).name.includes("History"));
    return(
    <div className="layout-container">
        <Sidebar/>
        <div className="content">
            {clientData &&
            <>
                <div className="header">
                    <HeaderHistory title={`Historial de Cliente`} clientData={clientData}/>
                </div>
                <div className="view history-client">
                <UserData clientData={clientData}/>
                {historyComponents}
                {history}
                </div>
            </>
            }
        </div>
    </div>
    )
}