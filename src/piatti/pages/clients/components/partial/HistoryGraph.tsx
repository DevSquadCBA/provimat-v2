import { ClientWithBudgetData } from '@/interfaces/dto';
import { formatPrice } from '@/services/common';
import {  CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type Props = {
    clientData:ClientWithBudgetData|undefined
}

export function HistoryGraph({clientData}:Props) {
    
    const calculatePercentage = ():number => {
        if(!clientData) return 0;
        const total = clientData.totalPaid as number + clientData.totalDue as number;
        return Math.round((clientData.totalPaid as number  * 100) / total);
    } 
    
    return <>
    <CircularProgressbarWithChildren value={calculatePercentage()} strokeWidth={8} >
            {clientData &&  
                <div className='info-amount'>
                    <div> Monto Restante</div>
                    <span className='remaining-amount'>${formatPrice(clientData.totalDue as number)}</span>
                    <div> Total</div>
                    <span className='total-amount'>${formatPrice(clientData.totalPaid as number + clientData.totalDue as number)}</span>
                </div>
            }
    </CircularProgressbarWithChildren>
    </>
}