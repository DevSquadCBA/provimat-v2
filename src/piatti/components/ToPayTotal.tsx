import { formatPrice } from "@/services/common";
import { InputNumber } from "primereact/inputnumber";
import { MutableRefObject } from "react";
type Props = {
    salesProducts: {total:number, paid:number}
    montoAPagar:MutableRefObject<HTMLInputElement>
}
export function ToPayTotal({salesProducts,montoAPagar}:Props){
    return <div className="flex justify-content-start flex_column ">
                <p className="flex justify-content-start"><span className="text-important text-2xl modals-title">Detalles de Pago</span></p>
                <div className="flex flex_row">
                    <div className="flex flex_column items-start">
                        <p className="text-important text-xl m-1 modals-title-amount">Monto a pagar</p>
                        <InputNumber 
                        inputRef={montoAPagar} 
                        locale="es-AR" 
                        mode="currency" 
                        currency="ARS" 
                        minFractionDigits={0} 
                        maxFractionDigits={0}
                        currencyDisplay="symbol" 
                        max={salesProducts.total - salesProducts.paid} 
                        min={0} 
                        className="w-full" />
                    </div>
                    {salesProducts.total && 
                    <div className="flex flex_column ml-8">
                        <div>
                            <p className="text-important text-xl m-1 modals-title-amount">Falta Abonar</p>
                            <p className="text text-3xl p-0 m-0 verde-medio">${formatPrice(salesProducts.total - salesProducts.paid)}</p>
                        </div>
                        <div>
                            <p className="text-important text-xl m-1 modals-title-amount">Total</p>
                            <p className="text text-3xl p-0 m-0 verde-medio">${formatPrice(salesProducts.total)}</p>
                        </div>
                    </div>
                    }
                </div>
            </div>
}