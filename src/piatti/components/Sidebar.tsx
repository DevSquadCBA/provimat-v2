import { setSelectedView } from "@/reducers/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import {reducers} from '@/store';
import { MenuView } from "@/interfaces/interfaces";
import logo from '@/assets/sidebar/SIP.svg';

export function Sidebar() {
    const dispatch = useDispatch();
    const state = useSelector((state:reducers)=>state.sideBar as unknown as MenuView);
    const handleClick = (previous:string, next:string|null, selectedView:string) => {
        dispatch(setSelectedView({selectedView,previous,next}));
    }

    const setClass = ({selectedView, previous, next}:MenuView, id:string) => {
        console.log(selectedView)
        if(selectedView==id) return 'selected';
        if(previous==id) return 'previous';
        if(next==id) return 'next';
        return '';
    }
    return (
        <div className="sidebar">
           <div className="sidebar_container">
            <img src={logo} className="sidebar__logo" alt="logo PROVIMAT"></img>
                <nav className="sidebar__nav">
                    <ul className="sidebar__list">
                        <li className={`menu_item ${setClass(state, 'empty')}`} ><div className="empty"></div></li>
                        <li onClick={()=>handleClick('empty','providers','clients')}     id="clients"   className={`menu_item ${setClass(state, 'clients')}`}   >
                            <button><div className="menu_item__logo"></div><span>Clientes</span></button></li>
                        <li onClick={()=>handleClick('clients','products','providers')}  id="providers" className={`menu_item ${setClass(state, 'providers')}`} ><button><div className="menu_item__logo"></div><span>Proveedores</span></button></li>
                        <li onClick={()=>handleClick('providers', 'sales','products')}   id="products"  className={`menu_item ${setClass(state, 'products')}`}  ><button><div className="menu_item__logo"></div><span>Productos</span></button></li>
                        <li onClick={()=>handleClick('products', 'submenu', 'sales')}      id="sales"   className={`menu_item ${setClass(state, 'sales')}`}     ><button><div className="menu_item__logo"></div><span>Ventas</span></button></li>
                        <li className={`menu_item ${setClass(state, 'submenu')}`} ><div className="empty"></div></li>
                    </ul>
                </nav>
           </div>
        </div>
    )
    
}