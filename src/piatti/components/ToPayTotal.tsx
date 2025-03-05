import { InputNumber } from "primereact/inputnumber";
import { MutableRefObject } from "react";
type Props = {
    salesProducts: {total:number, paid:number}
    montoAPagar:MutableRefObject<HTMLInputElement>
}
export function ToPayTotal({salesProducts,montoAPagar}:Props){
    return <div className="flex justify-content-start flex_column ">
                <p className="flex justify-content-start"><span className="text-important text-2xl">Detalles de Pago</span></p>
                <div className="flex flex_row">
                    <div className="flex flex_column">
                        <p className="text-important m-0">Monto a pagar</p>
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
                    <div className="flex flex_column ml-8">
                        <div>
                            <p className="text-important text-xl m-1">Falta Abonar</p>
                            <p className="text text-3xl p-0 m-0 verde-medio">${salesProducts.total - salesProducts.paid}</p>
                        </div>
                        <div>
                            <p className="text-important text-xl m-1">Total</p>
                            <p className="text text-3xl p-0 m-0 verde-medio">${salesProducts.total}</p>
                        </div>
                    </div>
                </div>
            </div>
}