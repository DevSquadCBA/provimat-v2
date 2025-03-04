import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
import { convertToVerboseDay } from "./common";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { IProvider } from "@/interfaces/dbModels";

const entity = EntityList.muebles

function redirectToLogin(){
    localStorage.removeItem('token');
   throw new Error('Unauthorized');
}

class Client {
    all = async (token:string|null)=>{
        const response = await fetch(`${API_URL}/clients`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = data.map((e:ClientWithBudgetData)=>({...e, lastModification: convertToVerboseDay(e.lastModification)}));
        return transformedData
    }
    get = async (id:string,token:string|null)=>{
        const response = await fetch(`${API_URL}/client/${id}`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        const transformedData = {...data, lastModification: convertToVerboseDay(data.lastModification)};
        return transformedData
    }
}

class Provider {
    all = async (token:string|null)=>{
        const response = await fetch(`${API_URL}/provider`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
    create = async(token:string|null,data:Partial<IProvider>)=>{
        const response = await fetch(`${API_URL}/provider`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }, method: 'POST', body: JSON.stringify(data)});
        const dataResponse = await response.json();
        if(dataResponse.statusCode == 401) return redirectToLogin();
        if(dataResponse.statusCode && dataResponse.statusCode !== 200) throw new Error(dataResponse.message);
        return dataResponse;
    }
}
class Product {
    all = async (token:string|null)=>{
        const response = await fetch(`${API_URL}/products`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
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

class Sale {
    history = async (id:number|undefined,token:string|null)=>{
        const response = await fetch(`${API_URL}/client/${id}/sales/`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        if(data.statusCode == 401) return redirectToLogin();
        if(data.statusCode && data.statusCode !== 200) throw new Error(data.message);
        return data;
    }
}

class User {
    all = async (token:string|null)=>{
        const response = await fetch(`${API_URL}/users`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
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
    static Sale: Sale = new Sale();
    static User:User = new User();
    static Auth:Auth = new Auth();
}