import { setSelectedView} from "@/reducers/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { reducers } from '@/store';
import { MenuView } from "@/interfaces/interfaces";
import logo from '@/assets/sidebar/SIP.svg';
import { useNavigate } from "react-router-dom";

export function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((state:reducers)=>state.sideBar as unknown as MenuView);
    const handleClick = (previous:string, next:string|null, selectedView:string, submenu:string) => {
        dispatch(setSelectedView({selectedView,previous,next, submenu}));
        switch(selectedView) {
            case 'clients':
                navigate(`/clientes`);
                break;
            case 'providers':
                navigate(`/proovedores`);
                break;
            case 'products':
                navigate(`/productos`);
                break;
            case 'sales':
                navigate(`/ventas/presupuesto`);
                break;
            case 'team':
                navigate(`/equipo`);
                break;
            default:
                break;
        }
    }
    const handleSubmenuClick = (submenu:string) => {
        dispatch(setSelectedView({selectedView:submenu,previous:'empty',next:'empty'}));
        switch(submenu) {
            case 'presupuesto':
                navigate(`/ventas/presupuesto`);
                break;
            case 'proforma':
                navigate(`/ventas/proforma`);
                break;
            case 'comprobante':
                navigate(`/ventas/comprobante`);
                break;
            default:
                break;
        } 
    }

    const setClass = ({selectedView, previous, next, submenu}:MenuView, id:string) => {
        if(selectedView==id) return 'selected';
        if(previous==id) return 'previous';
        if(next==id) return 'next';
        if(submenu==id) {
            console.log('submenu',submenu);
        }
        return '';
    }

    return (
        <div className="sidebar">
           <div className="sidebar_container">
            <img src={logo} className="sidebar__logo" alt="logo PROVIMAT"></img>
                <nav className="sidebar__nav">
                    <ul className="sidebar__list">
                        <li className={`menu_item ${setClass(state, 'empty')}`} ><div className="empty"></div></li>
                        <li onClick={()=>handleClick('empty','providers','clients', 'empty' )}     id="clients"   className={`menu_item ${setClass(state, 'clients')}`}   ><button><div className="menu_item__logo"></div><span>Clientes</span></button></li>
                        <li onClick={()=>handleClick('clients','products','providers', 'empty')}   id="providers" className={`menu_item ${setClass(state, 'providers')}`} ><button><div className="menu_item__logo"></div><span>Proveedores</span></button></li>
                        <li onClick={()=>handleClick('providers', 'sales','products', 'empty')}    id="products"  className={`menu_item ${setClass(state, 'products')}`}  ><button><div className="menu_item__logo"></div><span>Productos</span></button></li>
                        <li onClick={()=>handleClick('products', 'submenu', 'sales', 'presupuesto')}  id="sales"     className={`menu_item ${setClass(state, 'sales')}`}     ><button><div className="menu_item__logo"></div><span>Ventas</span></button></li>
                        <li id="submenu" className={`menu_item ${setClass(state, 'submenu')}`}  >
                            <ul className="sidebar__submenu__list" id="submenu"> 
                                <li onClick={()=>handleSubmenuClick('presupuesto')}  id="presupuesto" className={`submenu_item ${setClass(state, 'presupuesto')}`} ><button><div className="submenu_item__logo"></div><span>Presupuesto</span></button></li>
                                <li onClick={()=>handleSubmenuClick('proforma')}  id="proforma" className={`submenu_item ${setClass(state, 'proforma')}`} ><button><div className="submenu_item__logo"></div><span>Proforma</span></button></li>
                                <li onClick={()=>handleSubmenuClick('comprobante')}  id="comprobante" className={`submenu_item ${setClass(state, 'comprobante')}`} ><button><div className="submenu_item__logo"></div><span>Comprobante</span></button></li>
                            </ul>
                        </li>
                        <li onClick={()=>handleClick('sales', 'empty', 'team', 'empty')}     id="team"      className={`menu_item ${setClass(state, 'team')}`}      ><button><div className="menu_item__logo"></div><span>Equipo</span></button></li>

                    </ul>
                </nav>
           </div>
        </div>
    )
    
}