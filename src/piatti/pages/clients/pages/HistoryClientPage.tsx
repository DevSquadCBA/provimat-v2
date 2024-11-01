import { useEffect, useState } from "react";
import { ClientHistory } from "../components/ClientHistory";
import { LayoutContainerHistory } from "@/piatti/layout/LayoutContainerHistory";
import { IClient } from "@/interfaces/dbModels";
import API from "@/services/API";
import { useParams } from "react-router-dom";

export function HistoryClientPage() {
    const {clientId} = useParams();
    const [client,setClient] = useState<IClient>();
    
    useEffect(() => {
        (async () => {
            if(!clientId) return
            const response = await API.Client.get(clientId);
            setClient(response);
        })();
    }, [clientId]);

    return <LayoutContainerHistory 
            clientData={client}
            historyComponents={
            <></>// @TODO: agregar botón de nuevo cliente>
            }>
            <ClientHistory client={client}></ClientHistory>
        </LayoutContainerHistory>
}