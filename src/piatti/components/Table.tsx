import { DataTable, DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData, DataTableRowClickEvent, DataTableValueArray } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import {  useState } from 'react';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

import './Table.scss';
import { TableColumns } from '@/interfaces/interfaces';

type Props ={
    placeholder?: string
    columns:TableColumns[]
    data: DataTableValueArray,
    onRowClick?: (e:DataTableRowClickEvent) => void,
    footer?: JSX.Element,
    minimalQuantity?: number
}

export function Table({columns, data, placeholder, onRowClick, footer,minimalQuantity=30}:Props) {
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
    const renderHeader = () => {
        return (
            <div className='flex justify-content-between'>
                <div className="flex justify-content-start">
                    <Dropdown options={[30,50,100,500,1000]} value={selectedQty} onChange={onQtyChange} />
                </div>
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={placeholder} />
                    </IconField>
                </div>
            </div>
        );
    };
    const header = renderHeader();
    const key = columns.find((column)=>column.isKey)?.field;
    const order = columns.find((column)=>column.order)?.field;
    return <DataTable 
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
        </DataTable>;
}