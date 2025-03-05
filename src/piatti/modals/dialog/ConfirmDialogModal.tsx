import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Dispatch, SetStateAction } from "react";

type Props ={
    message: string,
    accept: () => void;
    reject: () => void;
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
}
export function ConfirmDialogModal({message, accept, reject, visible, setVisible}:Props) {
    const content = (
        <div className="confirm-dialog-modal">
            <div className="flex align-items-center flex_column">
                <span className="confirm-dialog-message">{message}</span>
                <div className="buttons-container flex flex_rows">
                    <Button className="accept" onClick={accept}>Guardar</Button>
                    <Button className="reject" onClick={reject}>No guardar</Button>
                    <Button className="cancel" onClick={()=>setVisible(false)}>Cancelar</Button>
                </div>
            </div>
        </div>
    )
   return <ConfirmDialog
        group="headless"
        visible={visible}
        content={content}
        onHide={() => setVisible(false)}
    />
}

/*
onHide={()=>setVisible(false)}
        message={message}
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        style={{ width: '50vw' }}
        breakpoints={{ '1100px': '75vw', '960px': '100vw' }}
        */