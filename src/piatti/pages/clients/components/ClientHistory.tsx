import { IClient } from "@/interfaces/dbModels"

type Props = {
    client:IClient | undefined
}
export function ClientHistory({client}:Props) {
    return <> 
        {client &&
            <>Soy el historial de {client.name}</>
        }
    </>
}