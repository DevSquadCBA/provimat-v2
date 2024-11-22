import { LayoutContainerTable } from "@/piatti/layout/LayoutContainerTable"
import { ProductsTable } from "../components/ProductsTable"

export function ProductsPage() {
    return <LayoutContainerTable title="Listado de Productos" tableComponents={<></>}>
            <ProductsTable></ProductsTable>
        </LayoutContainerTable>
}