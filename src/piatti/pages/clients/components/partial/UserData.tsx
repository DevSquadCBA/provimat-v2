import { ClientWithBudgetData } from "@/interfaces/dto";
import email from '@/assets/clients/email.svg'
import whatsapp from '@/assets/clients/whatsapp.svg'
import address from '@/assets/clients/address.svg'
import phone from '@/assets/clients/phone.svg'
import user from '@/assets/clients/user.svg'
import pencil from '@/assets/pencil.svg'
import trash from '@/assets/trash.svg'
import calendar from '@/assets/calendar.svg'

//import {assets} from "../../../../assets/imagese"
type Props = {
    clientData:ClientWithBudgetData|undefined
}
export function UserData({clientData}:Props) {
    const contactInfo = [
        { icon: email, value: clientData?.email },
        { icon: whatsapp, value: clientData?.whatsapp },
        { icon: address, value: clientData?.address },
        { icon: phone, value: clientData?.phone },
    ];
    
    return (
        <div className="view__user history-client flex space-between">
            { clientData &&
                <>
                    <div className="data_user">
                    <div className="data_user_update">
                        <img src={pencil} alt="edit" />
                        <img src={trash} alt="delete" />
                    </div>
                    <div className="data_user_container">
                        <div className="user_icon">
                            <img src={user} alt="" />
                        </div>
                        <div className="user_identity">
                            <h1>{clientData.name}</h1>
                            <div className="data_user_identity_extra">
                                <p className="fantasy_name">{clientData.fantasyName}</p>
                                <p className="client_id">N° de Cliente: <span>{clientData.id}</span></p>
                            </div>
                        </div>
                    </div>
                        <div className="data_user_info">
                            <div className="data_user_info_contact">
                                {
                                    contactInfo.map(({icon, value}, index) => (
                                        <div key={index} className="data_user_info_contact_item">
                                            <img src={icon} alt="" />
                                            <p>{value}</p>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="data_user_info_extra">
                                <p>Código Fiscal: <span className="fiscal_code">{clientData.fiscalCategory}</span></p>
                                <p>Provincia: <span>{clientData.province}</span></p>
                                <p>Localidad: <span>{clientData.localidad}</span></p>
                            </div>
                        </div>    
                    </div>   
                    <div className="data_graph">
                        <div className="data_graph_date">
                            <img src={calendar} alt=""/>
                            <p>Próxima Entrega Estimada:</p>
                            <h3>21-07-2023 harcode</h3>
                        </div>
                        <div className="data_graph_progress"></div>
                    </div>         
                </>
            }
        </div>
    )
}