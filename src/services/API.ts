import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
import { convertToVerboseDay } from "./common";
import { ClientWithBudgetData } from "@/interfaces/dto";

const entity = EntityList.muebles

function redirectToLogin(){
    localStorage.removeItem('token');
    window.location.href = `/`;
}

class Client {
    all = async ()=>{
        const response = await fetch(`${API_URL}/clients`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = data.map((e:ClientWithBudgetData)=>({...e, lastModification: convertToVerboseDay(e.lastModification)}));
        return transformedData
    }
    get = async (id:string)=>{
        const response = await fetch(`${API_URL}/client/${id}`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = {...data, lastModification: convertToVerboseDay(data.lastModification)};
        return transformedData
    }
}

class Provider {
    all = async ()=>{
        const response = await fetch(`${API_URL}/provider`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}
class Product {
    all = async ()=>{
        const response = await fetch(`${API_URL}/products`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200){
            console.log(data);
            throw new Error(data.message);
        } 
        return data;
    }
}


class User {
    all = async ()=>{
        const response = await fetch(`${API_URL}/users`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}
class Auth{
    login = async (credentials:{username:string, password:string})=>{
        const response = await fetch(`${API_URL}/auth/login`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
        }, method: 'POST', body: JSON.stringify({email: credentials.username, password: credentials.password})});
        const data = await response.json();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}
export default class API {
    static Client: Client = new Client();
    static Provider: Provider = new Provider();
    static Product: Product = new Product();
    static User:User = new User();
    static Auth:Auth = new Auth();
}