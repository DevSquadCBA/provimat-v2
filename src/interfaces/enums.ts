export enum SaleStates {
    presupuesto = 'presupuesto',            // cuando se crea
    proforma = 'proforma',                  // pago parcial o cuando hace un pago
    comprobante = 'comprobante',            // cuando define las caracteristicas
    in_order = 'in_order',                  // cuando le avisa al proveedor
    in_provider = 'in_provider',            // cuando el proveedor acepta el pedido, aca se disparan los estados del producto
    delayed_provider = 'delayed_provider',  // cuando está todo listo, pero el proveedor tiene demora
    finished = 'finished',                  // cuando el cliente ya tiene completo esta venta
    canceled = 'canceled'                   // cuando el cliente cancela el pedido por algun motivo
}
export const SalesStatesValues:SaleStates[] = [
    SaleStates.presupuesto,
    SaleStates.proforma,
    SaleStates.comprobante,
    SaleStates.in_order,
    SaleStates.in_provider,
    SaleStates.delayed_provider,
    SaleStates.finished,
    SaleStates.canceled
];

export enum StateProduct{
    uninitiated = 'uninitiated',            // 0 - El producto esta en una venta con estado presupuesto o proforma
    to_confirm = 'to_confirm',              // 1 - El producto esta en una venta con estado comprobante
    pending_shipping = 'pending_shipping',  // 2 - El producto esta en una venta con estado in_order
    out_of_stock = 'out_of_stock',          // 3 - El producto esta en una venta con estado sin stock
    shipping = 'shipping',                  // 3 - Envio en proceso de parte del proveedor
    on_deposit = 'on_deposit'               // 4 - El producto ya esta en depósito
}

export const StateProductValues:StateProduct[] = [
    StateProduct.uninitiated,
    StateProduct.to_confirm,
    StateProduct.pending_shipping,
    StateProduct.out_of_stock,
    StateProduct.shipping,
    StateProduct.on_deposit
];

export enum FiscalCategory{
    consumidor_final='Consumidor Final', 
    monotributista='Monotributista', 
    responsable_inscripto='Responsable Inscripto', 
    exento='Exento', 
    no_categorizado='No categorizado'
}

export const FiscalCategoryValues:FiscalCategory[] = [
    FiscalCategory.consumidor_final,
    FiscalCategory.monotributista,
    FiscalCategory.responsable_inscripto,
    FiscalCategory.exento,
    FiscalCategory.no_categorizado
]

export enum EntityList{
    muebles = 'muebles',
    instalaciones = 'instalaciones',
    puertas = 'puertas'
}
export const EntityListValues:EntityList[] = [
    EntityList.muebles, EntityList.instalaciones, EntityList.puertas
]

export function getEntityList(entity:string):EntityList{
    if(!Object.values(EntityList).includes(entity as EntityList)){
        return EntityList.muebles;
    }
    return Object.entries(EntityList).find(([, v]) => v === entity)?.[0] as EntityList | EntityList.muebles
}
export enum Role{
    ADMIN = 'Administrador',
    SUPERVISOR = 'Supervisor',
    SELLER = 'Vendedor',
}