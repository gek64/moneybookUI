import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"


interface TYPE {
    id?: string
    name: string
}

interface typeColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<TYPE> | null
    sortDirections: NzTableSortOrder[]
}

let TypeColumns: typeColumnItem[] = [
    {
        name: "名称",
        sortOrder: null,
        sortFn: (a: TYPE, b: TYPE) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    }
]

export {
    TYPE,
    TypeColumns
}