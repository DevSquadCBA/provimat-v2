import React from 'react'
import ReactDOM from 'react-dom/client'
import PiattiApp from './PiattiApp.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './store.ts'
import { PrimeReactProvider } from 'primereact/api';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store= {store}>
      <PrimeReactProvider>
          <PiattiApp />
      </PrimeReactProvider>
    </Provider>
    </BrowserRouter>
  </React.StrictMode>,
)
