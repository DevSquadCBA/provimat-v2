import { IProduct, IClient,IProvider, ISale, ISaleProduct, IUser } from "./dbModels"
import { SaleStates } from "./enums"

type MenuItems = 'empty'|'clients'| 'products' | 'providers' | 'sales' | 'submenu'
export type MenuView = {
    selectedView:MenuItems,
    previous:MenuItems,
    next:MenuItems
}
export type LocalData = {
    products : IProduct[],
    clients : IClient[],
    providers : IProvider[],
    sales : ISale[],
    salesProducts : ISaleProduct[],
    team: IUser[],
    productLastUpdated: number,
    providerLastUpdated: number,
    clientLastUpdated: number,
    saleLastUpdated: number,
    saleProductLastUpdated: number
}

export type UserData = {
    username: string|null,
    email: string|null,
    id: number|null,
    role: string|null,
    token: string|null
}
export type IHistorySales ={
    distinctProviders: number;
    granTotal: number;
    client: IClient,
    products: {
        id: number,
        name: string,
        code: number,
        providerId: number,
        salePrice: number,
        provider: {
            id: number,
            name: string
        },
        SaleProduct: ISaleProduct & { createdAt: string, updatedAt: string }
    }[],
    createdAt: string|null,
    updatedAt: string 
} & Partial<ISale>

export type TableColumns= {
    isKey: boolean
    order?: boolean
    field: string
    header: string
    filter?: string
    dataType?: 'text' | 'numeric' | 'date' | string | undefined
}

export type StateOption = {
    label: string;
    value: SaleStates;
    weight: number;
}

export type CreateModalProps = {
    header: JSX.Element,
    body: JSX.Element
    primaryButtonEvent: () => void,
    resizable?: boolean,
    footer?: JSX.Element,
}