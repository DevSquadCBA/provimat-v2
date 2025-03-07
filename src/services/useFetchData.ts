/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserData, removeToken } from "@/services/common";
import { ErrorResponse } from "@/interfaces/Errors";
import { showToast } from "@/reducers/toastSlice";
import { UnknownAction } from "@reduxjs/toolkit";

type FetchDataProps<T> = {
    callBack: (...args: any[]) => Promise<T[]>; 
    data?: any,
    id?: number
    mapData: (data: T[]) => T[]; 
    onSuccess: (data: T[]) => UnknownAction; 
    onFail?: (...args: any[]) => void
};

export function useFetchData<T>({ callBack, data, id, mapData,onSuccess, onFail }: FetchDataProps<T>) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const args:any[] = [userData.token];
                if (id) args.push(id.toString());
                if (data) args.push(data);
                let response = await callBack(...args);
                if(mapData){
                    response = mapData(response);
                }
                dispatch(onSuccess(response));
            } catch (e) {
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
    }, [dispatch, navigate, mapData, id, data, callBack, onSuccess, onFail]);
}
