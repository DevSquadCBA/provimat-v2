import { IUser } from "@/interfaces/dbModels";
import { CreateModalProps } from "@/interfaces/interfaces";
import { Table } from "@/piatti/components/Table";
import { setTeam} from '@/reducers/localDataReducer';
import API from "@/services/API";
import { getUserData, removeToken } from "@/services/common";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


interface RootState {
    localData: {
        team: IUser[]
    }
}

export function TeamTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const team = useSelector((state:RootState)=>state.localData.team);

    useEffect(() => {
        (async () => {
            try{
                const userData = getUserData();
                if (!userData ||!userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await API.User.all(userData.token);
                dispatch(setTeam(response));
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    }, [dispatch,navigate]);
    const columns = [
        { isKey: true,  order: false, field: 'id', header: 'ID' },
        { isKey: false, order: false, field: 'name', header: 'Nombre' },
        { isKey: false, order: false, field: 'email', header: 'Email' },
        { isKey: false, order: false, field: 'role.name', header: 'Rol' },
    ];
    
    const createNewModal:CreateModalProps = (
        {
            body: <></>,
            header: <></>,
            primaryButtonEvent: () => {},
            footer: <></>
        }
    )
    return <Table key={'team'} data={team} columns={columns} placeholder="usuario" newModalContent={createNewModal}/>;
}