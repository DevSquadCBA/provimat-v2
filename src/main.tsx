import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import 'primeflex/primeflex.css';
import './theme.scss';  
import React from 'react'
import ReactDOM from 'react-dom/client'
import PiattiApp from './PiattiApp.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store.ts'
import { addLocale, locale,  PrimeReactProvider} from 'primereact/api';

const esLocale ={
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Borrar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Semana',
  startsWith: 'Comienza con',
  endsWith: 'Termina con',
  contains: 'Contiene',
  notContains: 'No contiene',
  equals: 'Igual',
  notEquals: 'No igual',
  noFilter: 'Sin filtro',
  lt: 'Menor que',
  lte: 'Menor o igual que',
  gt: 'Mayor que',
  gte: 'Mayor o igual que',
  dateIs: 'Fecha es',
  dateIsNot: 'Fecha no es',
  dateBefore: 'Fecha antes',
  dateAfter: 'Fecha después',
  matchAll: 'Coincidir todos',
  addRule: 'Añadir regla',
  removeRule: 'Eliminar regla',
  accept: 'Aceptar',
  reject: 'Rechazar',
  choose: 'Elegir',
  upload: 'Cargar',
  cancel: 'Cancelar',
  pending: 'Pendiente',
  emptyMessage: 'No se encontraron resultados',
  emptyFilterMessage: 'No hay registros que mostrar',
}

addLocale('es', esLocale);

const primeReactConfig = {
  locale: 'es',
}
locale('es');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store= {store}>
      <PrimeReactProvider {...primeReactConfig}>
          <PiattiApp />
      </PrimeReactProvider>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
