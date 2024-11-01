import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
import { convertToVerboseDay } from "./common";
import { ClientWithBudgetData } from "@/interfaces/dto";

const entity = EntityList.muebles

class Client {
    all = async ()=>{
        const response = await fetch(`${API_URL}/clients`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity
        }});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = data.map((e:ClientWithBudgetData)=>({...e, lastModification: convertToVerboseDay(e.lastModification)}));
        return transformedData
    }
    get = async (id:string)=>{
        const response = await fetch(`${API_URL}/client/${id}`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity
        }});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = {...data, lastModification: convertToVerboseDay(data.lastModification)};
        return transformedData
    }
}

class Provider {
    all = async ()=>{
        const response = await fetch(`${API_URL}/provider`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity
        }});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}


export default class API {
    static Client: Client = new Client();
    static Provider: Provider = new Provider();
}