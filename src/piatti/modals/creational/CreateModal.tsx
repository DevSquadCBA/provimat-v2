import { CreateModalProps } from "@/interfaces/interfaces";
import { changeVisibilityModalCreation } from "@/reducers/modalsSlice";
import { reducers } from "@/store";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";

export function CreateModal({body,header,primaryButtonEvent,footer,resizable}:CreateModalProps){
    const dispatch = useDispatch();
    const {modalCreationVisible} = useSelector((state:reducers)=>state.modalsSlice as unknown as {modalCreationVisible: boolean});
    return (<Dialog className="create-modal"
                   resizable={resizable??false}
                   header={header}
                   visible={modalCreationVisible}
                   onHide={()=>{if (!modalCreationVisible) return; dispatch(changeVisibilityModalCreation({modalCreationVisible: false})); }}
                   footer={footer?footer:
                    <div className="flex justify-content-end">
                        <Button label="Guardar" onClick={primaryButtonEvent}></Button>
                    </div>
                   }
                >  
                {body}
            </Dialog>)
}