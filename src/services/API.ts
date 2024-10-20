import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
import { convertToVerboseDay } from "./common";
import { ClientWithBudgetData } from "@/interfaces/dto";
class Client {
    all = async ()=>{
        const response = await fetch(`${API_URL}/clients`, {headers: {
            'Content-Type': 'application/json',
            'entity': EntityList.muebles
        }});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = data.map((e:ClientWithBudgetData)=>({...e, lastModification: convertToVerboseDay(e.lastModification)}));
        return transformedData
    }
}


export default class API {
    static Client: Client = new Client();
}