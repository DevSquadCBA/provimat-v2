/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { getUserData, removeToken } from "./common";
import { useNavigate } from "react-router-dom";
import { useDispatch} from "react-redux";
import { showToast } from "@/reducers/toastSlice";
import {ErrorResponse} from "@/interfaces/errors";
import { setResponse } from "@/reducers/APIResponseSlice";

type MappingFunction<T> = (data:T[])=>T

type Props ={
    callBack: (...args: any[]) =>Promise<any>,
    data?: any,
    id?: number
    mapping?: MappingFunction<any>
    onSuccess: (...args: any[]) => void
    onFail?: (...args: any[]) => void
}

export function APIComponent({callBack, id,data,mapping,onSuccess, onFail}:Props){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log({callBack,id,data,mapping,onSuccess, onFail});
    //const {apiResponse} = useSelector((state:reducers)=>state.APIResponse as unknown as {apiResponse: APIResponseState});
    useEffect(()=>{
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    dispatch(showToast({ severity: "error", summary: "Error", detail: "Se ha perdido la sesión", life: 3000 }));
                    return;
                }
                let response;
                console.log({data,id})
                if(data && !id){
                    response = await callBack(userData.token,data);
                }
                if(data && id){
                    response = await callBack(userData.token,id,data);
                }
                if(!data && id){
                    console.log('le pego aquí');
                    response = await callBack(userData.token,id);
                }
                if(!data && !id){
                    response = await callBack(userData.token);
                }
                if(mapping){
                    response = mapping(response);
                }
                dispatch(setResponse(response));
                onSuccess(response);
            }catch(e){
                if(e instanceof ErrorResponse) {
                    dispatch(showToast({ severity: "error", summary: "Error", detail: e.message, life: 3000 }));
                    if(e.getCode() === 401){
                        removeToken();
                        navigate('/');
                    }
                    if(onFail){
                        onFail(e.message);
                    }
                }
                console.error(e);
            } 
            
        })();
    })
    return <></>
}