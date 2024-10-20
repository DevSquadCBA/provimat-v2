import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
class Client {
    all = async ()=>{
        const response = await fetch(`${API_URL}/client`, {headers: {
            'Content-Type': 'application/json',
            'entity': EntityList.muebles
        }});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}


export default class API {
    static Client: Client = new Client();
}