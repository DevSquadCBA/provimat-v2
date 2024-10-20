import { ReactNode } from "react"
import './HeaderTable.scss';

type Props = {
    title: string,
    tableComponents: ReactNode
}
export function HeaderTable({title,tableComponents} : Props) {

    return (
        <div className="header-table">
            <div className="user-content ">
                <div>Romera Juan Carlos</div>
                <div>Admin</div>
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