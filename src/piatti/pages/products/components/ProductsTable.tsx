import {  useState, useRef, Ref, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setProviders } from "@/reducers/localDataReducer";
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
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import  pencil  from '../../../../assets/pencil.svg';
import { reducers } from "@/store";
import { APIComponent } from "@/services/APIComponent";


type IProductWithProvider = IProduct & {provider: IProvider}

export function ProductsTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {products,providers} = useSelector((state:reducers)=>state.localData as unknown as {products: IProductWithProvider[], providers: IProvider[]} );

    const [selectedProvider, setSelectedProvider] = useState<IProvider | null>(null);

    const dropdownRef = useRef(null  as unknown); 
    const formRef = useRef(null as unknown);
    

    const handleProviderChange = useCallback((e: { value: number }) => {
      const provider = providers.find(p => p.id === e.value) || null;
      setSelectedProvider(provider)
        console.log("Proveedor seleccionado", e.value);
    }, [providers]);
    
    const createProductHandler = useCallback((e: React.FormEvent) => {
        const form = (document.getElementById('createProductForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data:IProduct = Object.fromEntries(
            new FormData(form).entries()
        ) as unknown as IProduct;
        if(!data){
            dispatch(showToast({ severity: "error", summary: "Error", detail: "Los campos de producto están vacíos", life: 3000 }));
            return;
        }
        data.salePrice = parseInt(data.salePrice as unknown as string);
        data.purchasePrice = parseInt(data.purchasePrice as unknown as string);
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Product.create(userData.token, data);
                dispatch(setProducts([...products, response]));
                dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
                dispatch(showToast({ severity: "success", summary: "Producto creado", detail: "Se ha creado el nuevo producto", life: 3000 }));
            } catch (e) {
                removeToken();
                navigate('/');
            }
        })();
    }, [dispatch, navigate, products]);

    const updateProductHandle = ( e: MouseEvent, idClient: number) => {
        const form = (document.getElementById('createProductForm') as HTMLFormElement);
        e.preventDefault();
        if (!form.reportValidity()) return;
        const data= Object.fromEntries(new FormData(form).entries());
        (async () => {
          try {
            const userData = getUserData();
            if (!userData || !userData.token) {
              removeToken();
              navigate('/');
              return;
            }
            const response = await API.Product.update(userData.token, data, idClient);
            dispatch(setProducts(products.map(p => p.id === response.id ? response : p)));
            dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
            dispatch(showToast({ severity: "success", summary: "Producto actualizado", detail: "Se ha actualizado el producto", life: 3000 }));
          } catch (e) {
            removeToken();
            navigate('/');
          }
        })();
    }

    const deleteProductHandle = ( id: number | undefined) => {
      if(!id) return;
      (async () => {
        try {
          const userData = getUserData();
          if (!userData || !userData.token) {
            removeToken();
            navigate('/');
            return;
          }
          const response = await API.Product.delete(userData.token, id);
          dispatch(setProducts(products.filter(p => p.id !== response.id)));
          dispatch(changeVisibilityModalCreation({ modalCreationVisible: false }));
          dispatch(showToast({ severity: "success", summary: "Producto eliminado", detail: "Se ha eliminado el producto", life: 3000 }));
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
        { isKey: false, order: false, field: 'buttonsProducts', header: '' },
    ]

    const body = useMemo(()=>( 
      <form id="createProductForm" ref={formRef as unknown as Ref<HTMLFormElement>} className="modal-body" style={{maxWidth: '700px'}}>
        <h3>Datos Requeridos</h3>
        <div className="flex flex_column gap_2 mt_3">
            <div className="flex flex_row space-between">
                <FloatLabel>
                    <InputText id="name" name="name" required/>
                    <label htmlFor="name">Nombre De Producto</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="code" name="code"  keyfilter="int" required/>
                    <label htmlFor="code">Referencia</label>
                </FloatLabel>    
            </div>
            <Dropdown
                inputRef = {dropdownRef as unknown as Ref<HTMLSelectElement> | undefined}
                value={selectedProvider?.id} 
                onChange={handleProviderChange}
                name="providerId" 
                options={providers} 
                optionLabel="name" 
                optionValue="id"
                editable placeholder="Seleccione un Proveedor" 
                className="w-fit mt_1" />
            <div className="flex flex_row space-between mt_1">
                <FloatLabel>
                    <InputText id="purchasePrice"
                        name="purchasePrice" 
                        keyfilter={/^[0-9]$/}
                        required/>
                    <label htmlFor="purchasePrice">Precio de Compra</label>
                </FloatLabel>
                <FloatLabel>
                    <InputText id="salePricee"
                        name="salePrice"
                        keyfilter={/^[0-9]$/}
                        required/>
                    <label htmlFor="salePrice">Precio de venta</label>
                </FloatLabel>
            </div>
        </div>
    </form>),[selectedProvider?.id, handleProviderChange, providers]);

    const createNewModal:CreateModalProps =  useMemo (() =>({
                header: <h2>Nuevo Producto</h2>,
                body,
                primaryButtonEvent: () => {},
                resizable: false,
                footer:<div>
                <Button rounded label="Crear" id="submitButton" onClick={createProductHandler} />
                </div>,
                onShow: ()=>setSelectedProvider(null),
    }), [body, createProductHandler]);

    const fillFieldsWithCurrentProductAndEditModal = (product: IProductWithProvider) => {
        const form: HTMLFormElement = formRef.current as unknown as HTMLFormElement;
        if(!form){
            setTimeout(fillFieldsWithCurrentProductAndEditModal, 200, product);
            return;
        }
        const elementName: HTMLInputElement = form['name'] as unknown as HTMLInputElement;
        elementName.value = product.name;
        form.code.value = product.code;
        setSelectedProvider(product.provider); 
        //form.providerId.parentNode.parentNode.querySelector('input').value = product.provider.name;
        form.purchasePrice.value = product.purchasePrice;
        form.salePrice.value = product.salePrice;

        elementName.classList.add('p-filled');
        form.code.classList.add('p-filled');
        form.purchasePrice.classList.add('p-filled');
        form.salePrice.classList.add('p-filled');
        const button = document.querySelector('#submitButton') as HTMLButtonElement;
        if(button){
            // create updateButton
            const idProduct = product.id as number;
            const newButtonUpdate = button.cloneNode(true) as HTMLButtonElement;
            newButtonUpdate.id = 'updateButton';
            newButtonUpdate.addEventListener('click',(e: MouseEvent) => updateProductHandle(e, idProduct));
            newButtonUpdate.classList.add('p-button-secondary');
            const label = newButtonUpdate?.querySelector('.p-button-label');
            if(label){
              label.setAttribute('label', 'Actualizar');
              label.innerHTML = 'Actualizar';
            }
            button.parentNode?.replaceChild(newButtonUpdate, button);
            //add deletebutton
            const newButtonDelete = button.cloneNode(true) as HTMLButtonElement;
            newButtonDelete.id = 'deleteButton';
            newButtonDelete.addEventListener('click', () => deleteProductHandle(product.id));
            const labelDelete = newButtonDelete?.querySelector('.p-button-label');
            if(labelDelete){
              labelDelete.setAttribute('label', 'Eliminar');
              labelDelete.innerHTML = 'Eliminar';
            }
            newButtonUpdate.parentNode?.prepend(newButtonDelete);
          }
            const title = document.querySelector('.p-dialog-title h2');
            if(title) title.innerHTML = 'Editar Producto';
    }
    const mappingFunction = (products: IProductWithProvider[]) => products.map((product: IProductWithProvider) => ({
        ...product,
        provider: product.provider.name,
        buttonsProducts: (
          <img src={pencil} onClick={(e) => {
            e.stopPropagation();
            dispatch(changeVisibilityModalCreation( {modalCreationVisible:true}));
            setTimeout(() => {
              fillFieldsWithCurrentProductAndEditModal(product);
            },500)
          }}>
          
          </img>
        )
        
    }));

    return <>
      {!products && 
        <APIComponent
          mapping={mappingFunction}
          callBack={API.Product.all}
          onSuccess={response=>dispatch(setProducts(response))}
        />
      }
      {!providers && 
        <APIComponent
          callBack={API.Provider.all}
          onSuccess={response=>dispatch(setProviders(response))}
        />
      }
      <Table 
        key={'products'} 
        data={products} 
        columns={columns} 
        placeholder="producto"
        newModalContent={createNewModal}
      />;
    </>

}