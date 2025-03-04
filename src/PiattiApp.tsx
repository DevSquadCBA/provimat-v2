import './PiattiApp.scss'
import { MainRoutes } from './piatti/routes/MainRoutes';
import { Toast } from 'primereact/toast';
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store";
import { clearToasts } from "./reducers/toastSlice";
function PiattiApp() {
  const toastRef = useRef<Toast>(null);
  const messages = useSelector((state: RootState) => state.toastSlice.messages);
  const dispatch = useDispatch();

  useEffect(() => {
      if (messages.length > 0) {
          messages.forEach((msg) => toastRef.current?.show(msg));
          dispatch(clearToasts()); // Limpiar mensajes después de mostrarlos
      }
  }, [messages, dispatch]);

  return (
    <>
      <Toast ref={toastRef} position="top-right" />
      <MainRoutes />
    </>
  )
}

export default PiattiApp
