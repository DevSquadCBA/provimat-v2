import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/reducers/localDataReducer";
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
import { showToast } from "@/reducers/toastSlice";
import API from "@/services/API";
import { IProduct, IProvider } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { getUserData, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";
import { CreateModalProps } from "@/interfaces/interfaces";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import{ InputNumber } from 'primereact/inputnumber';
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";


interface RootState {
    localData:{
        products: IProduct[]
    }
}

type IProductWithProvider = IProduct & {provider: IProvider}

export function ProductsTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const products = useSelector((state:RootState)=>state.localData.products);

    const [providersFilter, setProvidersFilter] = useState<IProvider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<IProvider | null>(null);


    useEffect(() => {
        const fetchData = async () => {
          try {
            const userData = getUserData();
            if (!userData || !userData.token) {
              removeToken();
              navigate("/");
              return;
            }
    
            const productResponse = await API.Product.all(userData.token);
            const formattedProducts = productResponse.map((product: IProductWithProvider) => ({
                ...product,
                provider: product.provider.name
            }))
            dispatch(setProducts(formattedProducts));
    
            const providerResponse = await API.Provider.all(userData.token);
            setProvidersFilter(providerResponse);
          } catch (e) {
            removeToken();
            navigate("/");
          }
        };   
        fetchData();
      }, [dispatch, navigate]);

      const handleProviderChange = (e: { value: number }) => {
        const provider = providersFilter.find(p => p.id === e.value) || null;
        setSelectedProvider(provider);
    };
    
    const createProductHandler = (e: React.FormEvent) => {
        const form = (document.getElementById('createProductForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(
            new FormData(form).entries()
        );
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                console.log(data);
                //const response = await API.Product.create(userData.token, data);
                //dispatch(setProducts([...products, response]));
                //dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
                //dispatch(showToast({ severity: "success", summary: "Producto creado", detail: "Se ha creado el nuevo producto", life: 3000 }));
            } catch (e) {
                removeToken();
                navigate('/');
            }
        })();
    }

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'code', header: 'Codigo' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'salePrice', header: 'Precio' },
        { isKey: false, order: false, field: 'provider', header: 'Proveedor', filter: "Buscar por proveedor" },
        { isKey: false, order: false, field: 'productType', header: 'Tipo' },
        { isKey: false, order: false, field: 'stock', header: 'Stock' },
    ]

    const body = ( 
    <form id="createProductForm" className="modal-body" style={{maxWidth: '700px'}}>
        <h3>Datos Requeridos</h3>
        <div className="flex flex_column gap_1 mt_2">
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="name" name="name" required/>
                    <label htmlFor="name">Nombre De Producto</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber id="reference" name="reference" mode="decimal" useGrouping={false}  minFractionDigits={0}  maxFractionDigits={0} required/>
                    <label htmlFor="reference">Referencia</label>
                </FloatLabel>    
            </div>
            <Dropdown
                value={selectedProvider?.id} 
                onChange={handleProviderChange}
                name="provider" 
                options={providersFilter} 
                optionLabel="name" 
                optionValue="id"
                editable placeholder="Seleccione un Proveedor" 
                className="w-fit mt_1" />
            <div className="flex flex_row space-between mt_1">
                <FloatLabel>
                    <InputNumber id="purchase-price" name="purchase-price" mode="currency" currency="ARS" locale="en-AR" required/>
                    <label htmlFor="purchase-price">Precio de Compra</label>
                </FloatLabel>
                <FloatLabel>
                    <InputNumber id="sale-price" name="sale-price" mode="currency" currency="ARS" locale="en-AR"required/>
                    <label htmlFor="sale-price">Precio de Venta</label>
                </FloatLabel>    
            </div>
        </div>
    </form>)

    const createNewModal:CreateModalProps = (
            {
                header: <h2>Nuevo Producto</h2>,
                body,
                primaryButtonEvent: () => {},
                resizable: false,
                footer:<div>
                <Button rounded label="Crear" onClick={createProductHandler} />
                </div>
            }
        )
    return <Table key={'products'} data={products} columns={columns} placeholder="producto" newModalContent={createNewModal}/>;

}