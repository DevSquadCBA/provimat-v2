import { ClientHistory } from "../components/ClientHistory";
import { LayoutContainerHistory } from "@/piatti/layout/LayoutContainerHistory";
import API from "@/services/API";
import { useParams } from "react-router-dom";
import { ClientWithBudgetData } from "@/interfaces/dto";
import { reducers } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { APIComponent } from "@/services/APIComponent";
import { IClient } from "@/interfaces/dbModels";
import { setClientSelected } from "@/reducers/localDataReducer";

export function HistoryClientPage() {
    const dispatch = useDispatch();
    const {clientId} = useParams();
    const {clientSelected} = useSelector((state:reducers)=>state.localData as unknown as {clientSelected: ClientWithBudgetData|null});

    return <>
        {!clientSelected &&
            <APIComponent 
                callBack={API.Client.get} 
                id={Number(clientId)}
                onSuccess={(data:IClient)=>dispatch(setClientSelected(data))}
            />
        }
        {clientSelected &&
            <LayoutContainerHistory 
                clientData={clientSelected}
                historyComponents={
                    <></>
                }>
                <ClientHistory client={clientSelected}></ClientHistory>
            </LayoutContainerHistory>
        }
        </>
}