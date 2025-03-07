import { ClientHistory } from "../components/ClientHistory";
import { LayoutContainerHistory } from "@/piatti/layout/LayoutContainerHistory";
import API from "@/services/API";
import { useNavigate, useParams } from "react-router-dom";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { getUserData, removeToken } from "@/services/common";
import { useEffect, useState } from "react";
import { ErrorResponse } from "@/interfaces/Errors";
import { showToast } from "@/reducers/toastSlice";
import { useDispatch } from "react-redux";

export function HistoryClientPage() {
    const navigate = useNavigate();
    const {clientId} = useParams();
    const [client,setClient] = useState<ClientWithBudgetData>();
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                if(!clientId) return
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.Client.get(userData.token,clientId);
                setClient(response);
            } catch (e) {
               if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                }else{
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "No se pudieron obtener las ventas", life: 3000 }));
                }
                console.error(e);
            }
        })();
    }, [clientId, dispatch, navigate]);

    return <>
        <LayoutContainerHistory 
            clientData={client}
            historyComponents={
                <></>
            }>
            <ClientHistory client={client}></ClientHistory>
        </LayoutContainerHistory>
        
        </>
}
