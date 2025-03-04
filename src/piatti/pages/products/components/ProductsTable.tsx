import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/reducers/localDataReducer";
import API from "@/services/API";
import { IProduct, IProvider } from "@/interfaces/dbModels";
import { Table } from "@/piatti/components/Table";
import { getUserData, removeToken } from "@/services/common";
import { useNavigate } from "react-router-dom";
import { CreateModalProps } from "@/interfaces/interfaces";


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

    useEffect(() => {
        (async () => {
             try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Product.all(userData.token);
                dispatch(setProducts(response.map((e:IProductWithProvider)=>({...e, provider: e.provider.name}))));
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    }, [dispatch, navigate]);

    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'code', header: 'Codigo' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'salePrice', header: 'Precio' },
        { isKey: false, order: false, field: 'provider', header: 'Proveedor', filter: "Buscar por proveedor" },
        { isKey: false, order: false, field: 'productType', header: 'Tipo' },
        { isKey: false, order: false, field: 'stock', header: 'Stock' },
        // { isKey: false, order: false, field: 'active', header: 'Activo' },
        // { isKey: false, order: true, field: 'lastModification', header: 'Ultima actualización' }
    ]
    const createNewModal:CreateModalProps = (
            {
                body: <></>,
                header: <></>,
                primaryButtonEvent: () => {},
                footer: <></>
            }
        )
    return <Table key={'products'} data={products} columns={columns} placeholder="producto" newModalContent={createNewModal}/>;

}