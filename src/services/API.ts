import { EntityList } from "@/interfaces/enums";
import { API_URL } from "../piatti/config/config";
import { convertToVerboseDay } from "./common";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { IClient, IProduct, IProvider, IUser } from "@/interfaces/dbModels";
import { ErrorResponse, Forbidden } from "@/interfaces/Errors";

const entity = EntityList.muebles

function redirectToLogin(){
   localStorage.removeItem('token');
   throw new Error('Unauthorized');
}

const GET = async (url:string, token:string|null)=>{
    const response = await fetch(url, {headers: {
        'Content-Type': 'application/json',
        'entity': entity,
        'Authorization': `Bearer ${token}`
    }});
    const data = await response.json();
    if(data.statusCode == 401) return redirectToLogin();
    if(data.statusCode && data.statusCode !== 200){
        console.error(data);
        throw new Error(data.message)
    }
    return data;
}
const POST = async (url:string, token:string|null,data:unknown)=>{
    const response = await fetch(url, {headers: {
        'Content-Type': 'application/json',
        'entity': entity,
        'Authorization': token? `Bearer ${token}`: ''
    }, method: 'POST', body: JSON.stringify(data)});
    const dataResponse = await response.json();
    if(dataResponse.statusCode == 401) return redirectToLogin();
    if(dataResponse.statusCode == 403) {
       // console.log('Usuario sin acceso');
        throw new Forbidden(dataResponse.message);
    }
    if(dataResponse.statusCode && [200,201].includes(dataResponse.statusCode) ){
        throw new Error(dataResponse.message);
        return redirectToLogin();
    }
    return dataResponse;
}
const PUT = async (url:string, token:string|null,data:unknown)=>{
    const response = await fetch(url, {headers: {
        'Content-Type': 'application/json',
        'entity': entity,
        'Authorization': `Bearer ${token}`
    }, method: 'PUT', body: JSON.stringify(data)});
    const dataResponse = await response.json();
    if(dataResponse.statusCode == 401) return redirectToLogin();
    if(dataResponse.statusCode == 403) {
        //console.log('Usuario sin acceso');
        throw new Forbidden(dataResponse.message);
    }
    if(dataResponse.statusCode && [200,201].includes(dataResponse.statusCode) ){
        throw new Error(dataResponse.message);
        return redirectToLogin();
    }
    return dataResponse;
}
const DELETE = async (url:string, token:string|null)=>{
    const response = await fetch(url, {headers: {
        'Content-Type': 'application/json',
        'entity': entity,
        'Authorization': `Bearer ${token}`
    }, method: 'DELETE'});
    const dataResponse = await response.json();
    if(dataResponse.statusCode == 401) return redirectToLogin();
    if(dataResponse.statusCode == 403) {
        //console.log('Usuario sin acceso');
        throw new Forbidden(dataResponse.message);
    }
    if(dataResponse.statusCode && [200,201].includes(dataResponse.statusCode) ){
        throw new Error(dataResponse.message);
        return redirectToLogin();
    }
    return dataResponse;
}

class Client {
    all = async (token:string|null)=>{
        const data = await GET(`${API_URL}/clients`, token);
        return data.map((e:ClientWithBudgetData)=>({...e, lastModification: convertToVerboseDay(e.lastModification)}));
    }
    get = async (token:string|null,id:string): Promise<ClientWithBudgetData>=>{
        const data = await GET(`${API_URL}/client/${id}`, token);
        return {...data, lastModification: convertToVerboseDay(data.lastModification)};
    }
    create = async(token:string|null,data:Partial<IClient>)=>{
        return await POST(`${API_URL}/client`, token,data);
    }
    update = async(token:string|null,data:Partial<IClient>,id:number)=>{
        return await PUT(`${API_URL}/client/${id}`, token,data);
    }
    delete = async(token:string|null,id:number)=>{
        try{
            return await DELETE(`${API_URL}/client/${id}`, token);
        }catch(e){
            console.error(e);
            if(e instanceof ErrorResponse){
                throw e;
            }
        }
    }
}

class Provider {
    all = async (token:string|null)=>{
        return await GET(`${API_URL}/provider`, token);
    }
    create = async(token:string|null,data:Partial<IProvider>)=>{
        return await POST(`${API_URL}/provider`, token,data);
    }
    update = async(token:string|null,data:Partial<IProvider>, id:number)=>{
        return await PUT(`${API_URL}/provider/${id}`, token,data);
    }
    delete = async(token:string|null,id:number)=>{
        return await DELETE(`${API_URL}/provider/${id}`, token);
    }
}
class Product {
    all = async (token:string|null)=>{
        return await GET(`${API_URL}/products`, token);
    }
    create = async(token:string|null,data:Partial<IProduct>)=>{
        const response = await fetch(`${API_URL}/product`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }, method: 'POST', body: JSON.stringify(data)});
        const dataResponse = await response.json();
        if(dataResponse.statusCode == 401) return redirectToLogin();
        if(dataResponse.statusCode && dataResponse.statusCode !== 200) throw new Error(dataResponse.message);
        return dataResponse;
    }
    update = async(token:string|null,data:Partial<IProduct>,id:number)=>{
        return await PUT(`${API_URL}/product/${id}`, token,data);
    }

    delete = async(token:string|null,id:number)=>{
        const response = await fetch(`${API_URL}/product/${id}`, {headers: {
            'Content-Type': 'application/json',
            'entity': entity,
            'Authorization': `Bearer ${token}`
        }, method: 'DELETE'});
        const dataResponse = await response.json();
        if(dataResponse.statusCode == 401) return redirectToLogin();
        if(dataResponse.statusCode && dataResponse.statusCode !== 200) throw new Error(dataResponse.message);
        return dataResponse;
    }
}
class Sale {
    get = async (token:string|null,state:string)=>{
        return await GET(`${API_URL}/sales?state=${state}`, token);
    }
    history = async (token:string|null,id:number|undefined)=>{
        return await GET(`${API_URL}/client/${id}/sales/`, token);
    }
    getSalesWithProducts = async (token:string|null,id:number|undefined)=>{
        return await GET(`${API_URL}/sale/${id}`, token);
    }
    update = async (token:string|null,id:number|undefined,data: unknown)=>{
        return await PUT(`${API_URL}/sale/${id}`, token,data);
    }
    addPayment = async(token:string|null,id:number|undefined,data: unknown)=>{
        try{
            return await POST(`${API_URL}/sale/${id}/addPayment`, token,data);
        }catch(e){
            console.error(e);
            if(e instanceof ErrorResponse){
                throw e;
            }
        }
    }
    updateDetails = async(token:string|null,id:number|undefined, data:unknown)=>{
        return await POST(`${API_URL}/sale/${id}/updateDetails`, token,data);
    }
    create = async (token:string|null,data:unknown)=>{
        return await POST(`${API_URL}/sale`,token, data);
    }
}

class User {
    all = async (token:string|null)=>{
        return await GET(`${API_URL}/user`, token);
    }
    create = async(token:string|null,data:Partial<IUser>)=>{
        return await POST(`${API_URL}/user`, token,data)
    }
    update = async(token:string|null,data:Partial<IUser>,id:number)=>{
        return await PUT(`${API_URL}/user/${id}`, token,data);
    }
    delete = async(token:string|null,id:number)=>{
        return await DELETE(`${API_URL}/user/${id}`, token);
    }
    
}

class Auth{
    login = async (credentials:{username:string, password:string})=>{
        // eslint-disable-next-line no-useless-catch
        try{
            return await POST(`${API_URL}/auth/login`, null,{email: credentials.username, password: credentials.password});
        }catch(e){
            throw e;
        }
    }
        
}
class Log{
    get = async(token:string|null) => await GET(`${API_URL}/log`, token);
}
class Metric{
    home = async(token:string|null) => await GET(`${API_URL}/home`, token);
}
export default class API {
    static Client: Client = new Client();
    static Provider: Provider = new Provider();
    static Product: Product = new Product();
    static Sale: Sale = new Sale();
    static User:User = new User();
    static Auth:Auth = new Auth();
    static Log:Log = new Log();
    static Metric:Metric = new Metric();
}