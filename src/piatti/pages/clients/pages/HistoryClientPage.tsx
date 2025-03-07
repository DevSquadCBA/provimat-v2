import { ClientHistory } from "../components/ClientHistory";
import { LayoutContainerHistory } from "@/piatti/layout/LayoutContainerHistory";
import API from "@/services/API";
import { useNavigate, useParams } from "react-router-dom";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { getUserData, removeToken } from "@/services/common";
import { useEffect, useState } from "react";

export function HistoryClientPage() {
    const navigate = useNavigate();
    const {clientId} = useParams();
    const [client,setClient] = useState<ClientWithBudgetData>();
    
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
            } catch (error) {
                removeToken();
                navigate('/');
            }
        })();
    }, [clientId, navigate]);

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