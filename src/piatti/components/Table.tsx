import { DataTable, DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData, DataTableRowClickEvent, DataTableValueArray } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import {  useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import './Table.scss';
import { CreateModalProps, TableColumns } from '@/interfaces/interfaces';
import { Button } from 'primereact/button';
import { reducers } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { changeVisibilityModalCreation } from '@/reducers/modalsSlice';
import { CreateModal } from '../modals/creational/CreateModal';

type Props ={
    placeholder?: string
    columns:TableColumns[]
    data: DataTableValueArray,
    onRowClick?: (e:DataTableRowClickEvent) => void,
    newModalContent: CreateModalProps,
    footer?: JSX.Element,
    minimalQuantity?: number
    callbackBeforeCreation?: () => void
}

export function Table({columns, data, placeholder, onRowClick, footer,newModalContent, minimalQuantity=30,callbackBeforeCreation}:Props) {
    const {modalCreationVisible} = useSelector((state:reducers) => state.modalsSlice as unknown as {modalCreationVisible: boolean});
    const dispatch = useDispatch();
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [selectedQty, setSelectedQty] = useState<number>(minimalQuantity);
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS,  },
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const _filters:{ [key: string]: DataTableFilterMetaData | DataTableOperatorFilterMetaData } = { ...filters };
        _filters['global']= { ...filters.global, value: value};
        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const onQtyChange = (e: DropdownChangeEvent) => {
        const value = e.target.value;
        setSelectedQty(Number(value));
    }
    const handleShowNewModal = ()=>{
        dispatch(changeVisibilityModalCreation({modalCreationVisible: true}));
    }
    const renderHeader = () => {
        return (
            <div className='flex justify-content-between'>
                <div className="flex justify-content-start">
                    <Dropdown options={[30,50,100,500,1000]} value={selectedQty} onChange={onQtyChange} />
                </div>
                <div className="flex justify-content-end gap-2">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={'Buscar ' +placeholder} />
                    </IconField>
                    <Button rounded icon="pi pi-plus" onClick={handleShowNewModal} label={"Agregar "+ placeholder}></Button>
                </div>
            </div>
        );
    };
    const header = renderHeader();
    const key = columns.find((column)=>column.isKey)?.field;
    const order = columns.find((column)=>column.order)?.field;
    
    return <><DataTable 
                key="tabla" 
                sortField={order} 
                sortOrder={-1} 
                selectionMode="single" 
                value={data} 
                paginator rows={selectedQty} 
                dataKey={key} 
                tableStyle={{ minWidth: '50rem' }} 
                header={header} 
                filters={filters}
                filterLocale='es'
                onRowClick={onRowClick}
                footer={footer}
                >
            {columns.map((column) => 
                <Column 
                    sortable={column.header? true : false}
                    key={column.field} 
                    field={column.field} 
                    header={column.header} 
                    dataType={column.dataType? column.dataType : 'text'}
                />)}
        </DataTable>
        {modalCreationVisible &&
            <CreateModal 
                body={newModalContent.body}
                header={newModalContent.header}
                primaryButtonEvent={newModalContent.primaryButtonEvent}
                footer={newModalContent.footer}
                callback={callbackBeforeCreation}
            />}
        </>
}