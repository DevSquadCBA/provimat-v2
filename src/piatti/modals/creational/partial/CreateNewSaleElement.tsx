import { FloatLabel } from "primereact/floatlabel";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { DropdownWithData } from "@/piatti/components/DropdownWithData";
import { useDispatch, useSelector } from "react-redux";
import { reducers } from "@/store";
import {  IProduct,  SaleWithProduct } from "@/interfaces/dbModels";
import { addQtyToProductinNewSaleData, removeNewSaleData, updateNewSaleData } from "@/reducers/localDataReducer";
import API from "@/services/API";
import React, { useEffect, useRef, useState } from "react";
import { DataTable, DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatPrice, getUserData, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { showToast } from "@/reducers/toastSlice";
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
type IProductWithAddToTheList = IProduct & {addToTheList: React.ReactNode, formattedPrice: string}
export function CreateNewSaleElement(){
    const {newSaleData} = useSelector((state:reducers)=>state.localData as unknown as {newSaleData: SaleWithProduct});
    const [products, setProducts] = useState([]) as unknown as [IProductWithAddToTheList[], React.Dispatch<React.SetStateAction<IProductWithAddToTheList[]>>]; 
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const form = useRef<HTMLFormElement>(null);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS,  },
            name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const columns = [
        { field: 'code', header: 'Código'},
        { field: 'name', header: 'Nombre'},
        { field: 'formattedPrice', header: 'Precio'},
        { field: 'addToTheList', header: ''}
    ];
    const columnsSelectedProducts = [
        { field: 'code', header: 'Código'},
        { field: 'name', header: 'Producto'},
        { field: 'quantity', header: 'Cantidad'},
        { field: 'total', header: 'Precio'},
        { field: 'desc', header: 'Desc'},
        { field: 'delete', header: ''}
    ]
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters:{ [key: string]: DataTableFilterMetaData | DataTableOperatorFilterMetaData } = { ...filters };
        _filters['global']= { ...filters.global, value: value};
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const createNewSale = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (!(form.current as HTMLFormElement).reportValidity()) return;
            const userData = getUserData();
            if (!userData || !userData.token) {
                removeToken();
                navigate('/');
                return;
            }
            //quito provider y el boton de productos
            const data = {...newSaleData}
            data.products = data.products.map(p => ({...p, provider: null, addToTheList: null}));
            if(data.createdAt== '') 
                data.createdAt = new Date().toISOString();
            const response = await API.Sale.create(data,userData.token)
            if(!response){
                dispatch(showToast({severity: 'error', summary: 'Error', detail: 'Ocurrio un error al crear la venta'}));
            }
            dispatch(showToast({severity: 'success', summary: 'Venta creada', detail: 'La venta se creo correctamente', life: 3000}));
            dispatch(removeNewSaleData());
            dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
            navigate('/ventas');
        }catch(e){
            console.error(e);
            dispatch(removeNewSaleData());
            dispatch(changeVisibilityModalCreation({modalCreationVisible: false}));
            removeToken();
            navigate('/');
            dispatch(showToast({severity: 'error', summary: 'Error', detail: 'Ocurrio un error al crear la venta'}));
        }
    }
    useEffect(() => {
        (async () => {
            try {
                //form validate
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Product.all(userData.token)as unknown as IProductWithAddToTheList[];
                response.map(element=>{
                    element.formattedPrice = '$ ' + formatPrice(element.salePrice);
                    element.addToTheList= 
                        <Button rounded onClick={(e)=>{
                                e.preventDefault();
                                const index = newSaleData.products.findIndex(product=>product.id===element.id);
                                if(index!==-1){
                                    return dispatch(addQtyToProductinNewSaleData({index}));
                                }
                                return dispatch(updateNewSaleData({...newSaleData,products: [...newSaleData.products,{...element,quantity: 1, total: element.salePrice}] }));
                        }}
                        >+</Button>
                    return element;
                })
                setProducts(response);
            }catch(e){
                removeToken();
                navigate('/');
            } 
        })();
    },[dispatch, navigate, newSaleData]);
    return (createNewSale && <form ref={form}>
        <div className="flex flex_columns p-4 pl-5 pr-5">
            <div className="left-column">
                <div className="flex flex_column">
                    <div className="flex flex_row align-items-center">
                        <FloatLabel className="flex flex_row ">
                            <Calendar locale="es" inputId="createdAt" minDate={new Date()} value={moment(newSaleData?.createdAt|| new Date()).toDate()} onChange={(e) => dispatch(updateNewSaleData({...newSaleData,createdAt: e.value}))} />
                            <label htmlFor="createdAt">Seleccionar la fecha del presupuesto</label>
                            <p className="text-important ml-3 mt-2">Se entrega en: <span className="text-important">60 días</span></p>
                        </FloatLabel>
                        <DropdownWithData required endpoint={API.Client.all} floatlabel="Seleccionar cliente" visualizationField="name" value="id" handleChange={(e) => dispatch(updateNewSaleData({...newSaleData, clientId: e.value}))}/>
                    </div>
                    <div className="flex flex_column mt-6 ">
                        <span className="p-float-label flex flex_row">
                            <label htmlFor="searchProducts">Buscar productos para agregar al presupuesto</label>
                            <IconField iconPosition="left" className="w-full p-inputwrapper-filled">
                                <InputIcon className="pi pi-search" />
                                <InputText id="searchProducts" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={''} className="w-full" />
                            </IconField>
                        </span>
                        <span className="p-float-label flex flex_column mt-2">
                            <span>Lista de productos</span>
                            <DataTable
                                id="searchProductsResults"
                                className="table-container mt-2 p-inputwrapper-filled"
                                style={{height: "40vh","overflowY": "scroll"}}
                                showHeaders={false}
                                lang="es"
                                emptyMessage="No hay productos"
                                value={products}
                                scrollable
                                max={300}
                                filters={filters}
                            >
                                {columns.map((e,i)=><Column key={i} field={e.field} header={e.header}></Column>)}
                            </DataTable>
                        </span>
                    </div>
                </div>
            </div>
            <div className="right-column ml-4">
                <div className="table-container">
                    <h3 className="text-important text-3xl font-black" style={{marginTop: "-2rem", marginBottom: 0}}>Detalle Presupuesto</h3>
                    <DataTable
                        style={{height: "50vh","overflowY": "scroll"}}
                        lang="es"
                        emptyMessage="No hay productos agregados"
                        value={newSaleData?.products}
                        scrollable
                        max={300}
                    >
                    {columnsSelectedProducts.map((e,i)=><Column key={i} field={e.field} header={e.header}></Column>)}
                    </DataTable>
                <div className="total-container">
                    <span className="text-important text-3xl">TOTAL</span>
                    <span className="price text-xl font-bold">${formatPrice(newSaleData?.total||0)}</span>
                </div>
                </div>

            </div>
        </div>
        <div className="footer-button flex justify-content-end pr-5">
            <Button rounded size="large" onClick={createNewSale}>Guardar</Button>
        </div>
        </form>
    )
}