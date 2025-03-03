import { EntityList,  SaleStates,  StateProduct} from './enums';
export type IClient = {
    name: string,
    fantasyName?: string,
    fiscalCategory: string,
    dni: string,
    email?: string,
    phone?: string,
    whatsapp?: string,
    province?: string,
    localidad?: string,
    address?: string,
    deleted?: boolean,
    updatedAt?: string | number | Date;
    createdAt?: string | number | Date;
}

export type IProduct = {
    id?: number,
    code: number,
    name: string,
    salePrice: number,
    purchasePrice: number,
    providerId: number,
    stockeable: number,
    negativeStock: number,
    productType: string,
    img: string,
    daysDelay: number,
    deleted?: boolean,
}

export type IProvider = {
    id?: number,
    name: string,
    fantasyName: string,
    cuit_cuil: number,
    email: string,
    province: string,
    locality: string,
    address: string,
    phone: string,
    voucherType: string,
    daysDelays: number,
    deleted?: boolean,
}
export type ISale = {
    id?: number,
    clientId: number,
    state: SaleStates,
    deleted?: boolean,
    total: number,
    paid: number,
    budgetDetails: string,
    dispatch: 'without' | 'with',
    seller: string,
    billing: string,
    estimatedDays: number,
    deadline: Date|null,
    entity: EntityList
}
export type ProductsInSale = {
    id:number,
    productId?:number,
    code: string,
    name: string,
    salePrice: number,
    purchasePrice: number,
    saleProducts?: { 
        quantity: number,
        state: StateProduct, 
        details?: string
    },
    quantity?: number,
    state?: StateProduct,
    details?: string,
    entity: EntityList
}
export type SaleWithProduct = ISale & {products: ProductsInSale[]}

export type ISaleProduct = {
    saleId: number,
    productId: number,
    quantity: number,
    state: StateProduct
    details?: string|null
}

export type IProductToAdd = {
    id: number,
    quantity: number,
    details?: string|null
}


export type IUser = {
    name: string,
    email: string,
    phone: string,
    whatsapp: string,
    address: string,
    role: IRol
}

export type IRol = {
    id: number,
    name: string
    description: string
}