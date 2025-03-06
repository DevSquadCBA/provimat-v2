import { getUserData, removeToken } from "@/services/common";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { SelectItemOptionsType } from "primereact/selectitem";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    required?: boolean
    endpoint: (token:string|null)=>Promise<unknown[]>
    visualizationField: string,
    value: string,
    floatlabel: string,
    handleChange: (e: { value: string }) => void
};
export function DropdownWithData({endpoint,visualizationField,value,handleChange, floatlabel, required}:Props){
    const navigate = useNavigate();
    const [data,setData] = useState() as unknown as [unknown[], React.Dispatch<React.SetStateAction<unknown>>];
    const [selectedElement, setSelectedElement] = useState(null);
    useEffect(()=>{
        (async()=>{
            try{
                const userData = getUserData();
                if (!userData || !userData.token) {
                    removeToken();
                    navigate('/');
                    return;
                }
                const response = await endpoint(userData.token);
                setData(response);
            }catch(e){
                removeToken();
                navigate('/');
            }
        })();
    },[endpoint, navigate])
    return <>
        {data && 
        <div className="flex flex_column w-4 ml-5">
            <span className="p-float-label flex flex_row w-full">
                <label htmlFor={`dropdown-${floatlabel.replace(" ","-")}`} className="">{floatlabel}</label>
                <Dropdown
                    required={required} 
                    className="w-full"
                    id={`dropdown-${floatlabel.replace(" ","-")}`}
                    value={selectedElement} 
                    options={data as SelectItemOptionsType | undefined} 
                    optionLabel={visualizationField} 
                    optionValue={value} 
                    onChange={(e)=>{
                        setSelectedElement(e.value)
                        handleChange(e);
                    }}
                />
             </span>
        </div>
            }
        {!data && <ProgressSpinner />}
    </>
}