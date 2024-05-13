import {HeaderHistory} from "@/piatti/components/HeaderHistory";
import { Sidebar } from "../components/Sidebar";

export function LayoutContainerTable() {
    return(
    <div className="layout-container">
        <Sidebar/>
        <div className="content">
            {/* @TODO: agregar el contenido */}
            <div className="header">
                <HeaderHistory />
            </div>
            <div className="view">
                {/* history view o history table */}
            </div>
        </div>
    </div>
    )
}