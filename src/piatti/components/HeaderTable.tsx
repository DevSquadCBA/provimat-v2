import { ReactNode } from "react"
import './HeaderTable.scss';
import { UserComponent } from "./UserComponent";

type Props = {
    title: string,
    tableComponents: ReactNode
}
export function HeaderTable({title,tableComponents} : Props) {

    return (
        <div className="header-table">
            <div className="user-content ">
               <UserComponent/>
            </div>
            <div className="titles-and-buttons">
                <div className="title">
                    {title}
                </div>
                <div className="tableButtons">
                    {tableComponents}
                </div>
            </div>
            
            
        </div>
    )
}