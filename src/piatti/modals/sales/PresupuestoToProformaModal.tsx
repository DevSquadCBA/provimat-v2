
import { IClient, SaleWithProduct } from "@/interfaces/dbModels"
import { SaleStates } from "@/interfaces/enums"
import { ToPayTotal } from "@/piatti/components/ToPayTotal"
import { removeSaleFromSales } from "@/reducers/localDataReducer"
import { changeVisibilityModalPresupuestoToProforma } from "@/reducers/modalsSlice"
import { showToast } from "@/reducers/toastSlice"
import API from "@/services/API"
import { formatDate, getUserData, removeToken } from "@/services/common"
import { reducers } from "@/store"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dialog } from "primereact/dialog"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

type SaleWithProductAndClient = SaleWithProduct & {client: IClient};

export function PresupuestoToProformaModal(){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {modalPresupuestoToProformaVisible,idSaleForModals} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalPresupuestoToProformaVisible: boolean, idSaleForModals: number});
    const [salesProducts,setSalesProducts] = useState([]) as unknown as [SaleWithProductAndClient,setSalesProducts:React.Dispatch<React.SetStateAction<SaleWithProductAndClient>>];
    const montoAPagar = useRef(null as unknown as HTMLInputElement);
    const handleClick = ()=>{
        if(!montoAPagar.current) return;
        const monto = parseInt(montoAPagar.current.value.replace(/\$|\.|,/g,'').trim() as unknown as string) || 0;
        const toPay = salesProducts.total - salesProducts.paid;
        // console.log({
        //     monto,
        //     toPay
        // })
        if((toPay != 0) && (typeof monto !== 'number' || monto<1)){
            dispatch(showToast({ severity: "error", summary: "Error", detail: "El monto debe ser mayor a 1", life: 3000 }));
            return
        }
        salesProducts.paid = +monto;
        salesProducts.state= SaleStates.proforma;
        salesProducts.products;
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                await API.Sale.update(userData.token,idSaleForModals,salesProducts);
                dispatch(removeSaleFromSales({id: idSaleForModals}));
                dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: false, idSaleForModals: 0}));
                dispatch(showToast({ severity: "success", summary: "Presupuesto actualizado", detail: "Se ha actualizado el presupuesto", life: 3000 }));
                // refresh the page
                setTimeout(() => {
                    window.location.reload();
                },500)
            } catch (e) {
                removeToken();
                navigate('/');
            }
        })();
    }
    const headerElement = (
        <h2 className="modal-title m-1 mt-2 mb-0 pl-3 pr-3">
            <span className="mr-2">ACTUALIZAR PRESUPUESTO</span>
            <svg width="36" height="22" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35.4999 11.009L35.5 11.009V11C35.5 10.782 35.4327 10.5671 35.3554 10.3979C35.2777 10.2276 35.1662 10.0519 35.031 9.9195C35.0305 9.91903 35.03 9.91856 35.0296 9.91809L25.9651 0.972657L25.9652 0.972624L25.9602 0.967889C25.3556 0.387321 24.3826 0.325452 23.6907 0.903859C23.0115 1.47159 23.0086 2.53554 23.6167 3.13264C23.6168 3.1327 23.6168 3.13277 23.6169 3.13283L30.0253 9.44716H2.13334C1.26668 9.44716 0.5 10.1081 0.5 10.9998C0.5 11.8914 1.26666 12.5525 2.13334 12.5525H30.0253L23.6169 18.8668C23.6167 18.8669 23.6166 18.8671 23.6165 18.8672C22.9937 19.479 23.0504 20.5116 23.6742 21.0813L23.6742 21.0813C24.3264 21.6768 25.368 21.6181 25.9657 21.0263L35.0251 12.086C35.2048 11.9204 35.3292 11.7404 35.4051 11.543C35.4805 11.3469 35.4972 11.1615 35.4999 11.009Z" fill="#0D3831" stroke="#0D3831"/>
            </svg>
            <span className="ml-2">PROFORMA</span>
        </h2>
    )
    const handleAddPaymentButton = async()=>{
        try{
            const monto = parseInt(montoAPagar.current.attributes.getNamedItem('aria-valuenow')?.value as unknown as string);
            const userData = getUserData();
            if (!userData || !userData.token) {
                removeToken();
                navigate('/');
                return;
            }
            const saleUpdated = await API.Sale.addPayment(userData.token,salesProducts.id,{paid: monto});
            salesProducts.paid = saleUpdated.paid;
            setSalesProducts({...salesProducts});
            dispatch(showToast({severity: 'success', summary: 'Pago agregado', detail: 'El pago se agrego correctamente'}));
        }catch(e){
            dispatch(showToast({severity: 'error', summary: 'Error', detail: 'Ocurrio un error al agregar el pago'}));
        }
    }
    const footerElement = (
        <div className="flex justify-content-end ">
            {salesProducts.paid != salesProducts.total &&
                <Button rounded onClick={handleAddPaymentButton}>Agregar un pago</Button>
            }
            <Button label="Actualizar a Proforma" rounded onClick={handleClick}></Button>
        </div>
    )
    const dataColums = [
        {field: 'quantity', header: 'Cantidad', sortable: true},
        {field: 'code', header: 'Codigo', sortable: true},
        {field: 'name', header: 'Producto', sortable: true},
        {field: 'salePrice', header: 'Precio', sortable: true},
    ]
    useEffect(()=>{
        (async ()=>{
            try{
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const salesProducts = await API.Sale.getSalesWithProducts(userData.token,idSaleForModals);
                setSalesProducts(salesProducts);
            }catch(e){
                console.log(e);
                removeToken();
                navigate('/');
            }
        })()
    },[idSaleForModals, modalPresupuestoToProformaVisible, navigate])
    return (<>
        {salesProducts &&
        <Dialog
            className="sales-modal"
            style={{minWidth: '50vw'}}
            visible={modalPresupuestoToProformaVisible} 
            header={headerElement} 
            footer={footerElement}
            onHide={()=>{if (!modalPresupuestoToProformaVisible) return; dispatch(changeVisibilityModalPresupuestoToProforma({modalPresupuestoToProformaVisible: false, idSaleForModals: 0})); }}
            >
                <div className="pr-6 pl-6">
                    <div className="flex space-between">
                        <p><span className="text-important">Fecha de Presupuesto:</span><span>{formatDate(salesProducts.createdAt)}</span></p>
                        <p><span className="text-important">Cliente:</span><span>{salesProducts.client?.name}</span></p>
                        <p className="dummy"></p>
                    </div>
                    <div className="flex justify-content-start text-important text-xl m-0 p-0 mb-2">
                        <p className="m-0 p-0 ">Productos</p>
                    </div>
                    <DataTable 
                        key="products_table"
                        value={salesProducts.products} 
                        header={null}
                        footer={null}
                        className="sales-modal-table"
                    >
                        {dataColums.map((col,i)=>(
                            <Column 
                                key={i} 
                                field={col.field} 
                                header={col.header} 
                                sortable={false}/>
                        ))}
                    
                    </DataTable>
                    <div className="footer">
                        <ToPayTotal salesProducts={salesProducts} montoAPagar={montoAPagar}></ToPayTotal>
                    </div>
                </div>
            </Dialog>
        }
    </>)
}
