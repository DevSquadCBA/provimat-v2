import { DataTable, DataTableFilterMeta, DataTableFilterMetaData, DataTableOperatorFilterMetaData, DataTableValueArray } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { FilterMatchMode } from 'primereact/api';
import { useState } from 'react';


type Props ={
    columns: {
        isKey: boolean
        field: string
        header: string
        filter?: string
    }[]
    data: DataTableValueArray,
}

export function Table({columns, data}:Props) {
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
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
    const renderHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </IconField>
            </div>
        );
    };
    const header = renderHeader();
    const key = columns.find((column)=>column.isKey)?.field;
    return <DataTable 
                key="tabla" 
                sortField={key} 
                sortOrder={1} 
                selectionMode="single" 
                value={data} 
                paginator rows={30} 
                dataKey={key} 
                tableStyle={{ minWidth: '50rem' }} 
                header={header} 
                filters={filters}
                filterLocale='es'
                >
            {columns.map((column) => 
                <Column sortable 
                    key={column.field} 
                    field={column.field} 
                    header={column.header} 
                    filter={column.filter ? true : false}
                    filterPlaceholder={column.filter ? column.filter : ''}
                    filterField={column.field}
                />)}
        </DataTable>;
}