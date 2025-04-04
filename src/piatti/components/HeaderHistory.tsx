import { Button } from "primereact/button"
import "./HeaderHistory.scss"
import { useNavigate } from "react-router-dom"
import { UserComponent } from "./UserComponent"
import { ClientWithBudgetData } from "@/interfaces/dto"
type Props = {
    title: string
    clientData: ClientWithBudgetData
}
export function HeaderHistory({title}:Props) {
    const navigate = useNavigate();
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
                <Button rounded size="small" label="Ir atrás" icon="pi pi-arrow-left" onClick={()=>navigate(`/clientes`)}/>
            </div>
        </div>
        
        
    </div>
    )
}