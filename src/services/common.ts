import { SaleStates, StateProduct } from "@/interfaces/enums";
import { StateOption, UserData } from "@/interfaces/interfaces";
import moment from "moment";
import { redirect } from "react-router-dom";

export function convertToVerboseDay(date: string|null): string|null {
    if (!date) {
        return null;
    }
    
    const getDiferences = (d1:Date, d2:Date): string => {
        const diff_time = d1.getTime() - d2.getTime();
        return parseFloat((diff_time / (1000 * 3600 * 24)).toString()).toFixed(0);
    }
    const getVerbose = (days: number) => {
        if (days<0 || days >= 167814637) { return null }
        if (days == 0) {
            return 'Hoy'
        } else if (days < 1) {
            return `${days} día`;
        } else if (days < 7) {
            return `${days} días`;
        } else if (days < 14) {
            return `${Math.trunc(days / 7)} semana`;
        } else if (days < 30) {
            return `${Math.trunc(days / 7)} semanas`;
        } else if (days < 60) {
            return `${Math.trunc(days / 30)} mes`;
        } else if (days < 365) {
            return `${Math.trunc(days / 30)} meses`;
        } else if (days < 730) {
            return `${Math.trunc(days / 365)} año`;
        } else {
            return `${Math.trunc(days / 365)} años`;
        }
    }
    const d = getDiferences(new Date(), new Date(date));
    return getVerbose(parseInt(d));
}

export function decodeJWTToken(token: string):UserData{
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return {...JSON.parse(jsonPayload),token};
}

export function getUserData():UserData|null{
    const token = localStorage.getItem('token');
    if(typeof token !== 'string') {
        removeToken();
        redirect('/');
        return null;
    }
    if (!token) {throw new Error('No token found');}
    try{
        return decodeJWTToken(token);
    }catch(e){
        removeToken();
        redirect('/');
        return null;
    }
}

export function setToken(token: string) {
    if(typeof token !== 'string') throw new Error('Token must be a string');
    localStorage.setItem('token', token);
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function getColorOfState(state: string):string {
    const colors: { [key in SaleStates]: string } = {
        [SaleStates.presupuesto]: '#19E052',
        [SaleStates.proforma]:    '#1986e0',
        [SaleStates.comprobante]: '#1937e0',
        [SaleStates.canceled]:    '#d50000', 
        // Para luego en comprobante
        [SaleStates.in_order]:         '#E00096',
        [SaleStates.in_provider]:      '#9B00E0',
        [SaleStates.delayed_provider]: '#5200E0',
        [SaleStates.finished]:         '#003FE0'
    }
    return colors[state as SaleStates];
}

export function getTranslationOfState(state: string):string {
    const translations: { [key in SaleStates]: string } = {
        [SaleStates.presupuesto]: 'Presupuesto',
        [SaleStates.proforma]:    'Proforma',
        [SaleStates.comprobante]: 'Comprobante',
        [SaleStates.canceled]:    'Cancelado', 
        // Para luego en comprobante
        [SaleStates.in_order]:         'En pedido',
        [SaleStates.in_provider]:      'En proveedor',
        [SaleStates.delayed_provider]: 'Demorado en proveedor',
        [SaleStates.finished]:         'Entregado'
    }
    return translations[state as SaleStates];
}

export function getColorOfProductState(state: string):string {
    const colors: { [key in StateProduct]: string } = {
        [StateProduct.uninitiated]:           '#EED865',
        [StateProduct.to_confirm]:            '#86bc33',
        [StateProduct.pending_shipping]:      '#49B886',
        [StateProduct.out_of_stock]:          '#E54444',
        [StateProduct.shipping]:              '#3A99B2',
        [StateProduct.on_deposit]:            '#276CA3'
    }
    return colors[state as StateProduct];
}

export function getTranslationOfProductState(state: string):string {
    const translations: { [key in StateProduct]: string } = {
        [StateProduct.uninitiated]:           'Sin iniciar',
        [StateProduct.to_confirm]:            'Por confirmar',
        [StateProduct.pending_shipping]:      'En envio',
        [StateProduct.out_of_stock]:          'Sin stock',
        [StateProduct.shipping]:              'En proveedor',
        [StateProduct.on_deposit]:            'En depósito'
    }
    return translations[state as StateProduct];
}

export function formatPrice(price: number|string):string {
    return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
export function formatDate(date: string):string {
    return moment(date).format('DD/MM/YYYY');
}

export const states:StateOption[] = [
    { label: getTranslationOfState(SaleStates.presupuesto), value: SaleStates.presupuesto, weight: 0 },
    { label: getTranslationOfState(SaleStates.proforma), value: SaleStates.proforma, weight: 1 },
    { label: getTranslationOfState(SaleStates.comprobante), value: SaleStates.comprobante, weight: 2 },
    { label: getTranslationOfState(SaleStates.in_order), value: SaleStates.in_order, weight: 3 },
    { label: getTranslationOfState(SaleStates.in_provider), value: SaleStates.in_provider, weight: 4 },
    { label: getTranslationOfState(SaleStates.delayed_provider), value: SaleStates.delayed_provider, weight: 5 },
    { label: getTranslationOfState(SaleStates.finished), value: SaleStates.finished, weight: 6 },
    { label: getTranslationOfState(SaleStates.canceled), value: SaleStates.canceled, weight: 7 },
]
export function getWeightOfState(state: string):number {
    return states.find(stateOption => stateOption.value === state)?.weight || 0;
}

export const regexForText =/^[A-Za-zÀ-ÖØ-öø-ÿñÑ\s]*$/

const percents:Record<SaleStates, number> = {
    [SaleStates.presupuesto]: 1,
    [SaleStates.proforma]: 15,
    [SaleStates.comprobante]: 30,
    [SaleStates.in_order]: 54,
    [SaleStates.in_provider]: 75,
    [SaleStates.delayed_provider]: 90,
    [SaleStates.finished]: 100,
    [SaleStates.canceled]: 0,
}
export function getPercentOfState(state: SaleStates):number {
    return percents[state];
}