import { SaleStates } from '@/interfaces/enums';
import { IHistorySales, StateOption } from '@/interfaces/interfaces';
import { getColorOfState,states as originalStates } from '@/services/common';
import { Avatar } from "primereact/avatar";
import { Dropdown } from 'primereact/dropdown';
import { useDispatch, useSelector} from 'react-redux';
import { changeState } from '@/reducers/modalsSlice';
import { RootState } from '@/store';

type Props ={
    sale: IHistorySales
}


export function StateSelector({sale}:Props){
    const selectedItem = useSelector((state: RootState) => state.modalsSlice.stateSelected || sale.state);
    const dispatch = useDispatch();
    let states = originalStates;
    const currentStateWeigth = states.find(state => state.value === sale.state)?.weight || 0;
    // remover los estados anteriores al estado actual, asi no se puede volver a un estado inicial:
    states = states.filter(state => state.weight >= currentStateWeigth);
    
    const selectedStateTemplate = (option:StateOption) => {
        return (
            <div className="state-selector_option">
                <Avatar className="circle-state" style={{ backgroundColor: getColorOfState(option.value as SaleStates) }} shape="circle"></Avatar>
                <span className="text-state">{option.label}</span>
            </div>
        );
    }
    const handleOnChange = (e: { value: SaleStates }) => {
        dispatch(changeState(e.value));
    }
    return (
        <Dropdown className='state-selector'
             value={selectedItem} 
             options={states} 
             onChange={handleOnChange} 
             valueTemplate={selectedStateTemplate} 
             itemTemplate={selectedStateTemplate} disabled={currentStateWeigth<2} />
    );
}
