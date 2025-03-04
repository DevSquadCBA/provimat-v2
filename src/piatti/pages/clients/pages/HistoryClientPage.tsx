import { useEffect, useState } from "react";
import { ClientHistory } from "../components/ClientHistory";
import { LayoutContainerHistory } from "@/piatti/layout/LayoutContainerHistory";
import { IClient } from "@/interfaces/dbModels";
import API from "@/services/API";
import { useNavigate, useParams } from "react-router-dom";
import { getUserData, removeToken } from "@/services/common";

export function HistoryClientPage() {
    const navigate = useNavigate();
    const {clientId} = useParams();
    const [client,setClient] = useState<IClient>();
    
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
                const response = await API.Client.get(clientId, userData.token);
                setClient(response);
            } catch (error) {
                removeToken();
                navigate('/');
            }
        })();
    }, [clientId, navigate]);

    return <LayoutContainerHistory 
            clientData={client}
            historyComponents={
            <></>// @TODO: agregar botón de nuevo cliente>
            }>
            <ClientHistory client={client}></ClientHistory>
        </LayoutContainerHistory>
}