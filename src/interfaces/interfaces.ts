type MenuItems = 'empty'|'clients'| 'products' | 'providers' | 'sales' | 'submenu'
export type MenuView = {
    selectedView:MenuItems,
    previous:MenuItems,
    next:MenuItems
}