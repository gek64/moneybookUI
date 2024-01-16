import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"

interface Type {
    id: string
    name: string
}

interface TypeColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<Type> | null
    sortDirections: NzTableSortOrder[]
}

export {
    Type,
    TypeColumnItem
}