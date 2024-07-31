import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"

interface PRODUCT {
    id?: string
    name: string
    code?: string
    specifications?: string
    remark?: string
}

interface productColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<PRODUCT> | null
    sortDirections: NzTableSortOrder[]
}

let ProductColumns: productColumnItem[] = [
    {
        name: "名称",
        sortOrder: null,
        sortFn: (a: PRODUCT, b: PRODUCT) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "编号",
        sortOrder: null,
        sortFn: (a: PRODUCT, b: PRODUCT) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "规格",
        sortOrder: null,
        sortFn: (a: PRODUCT, b: PRODUCT) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "备注",
        sortOrder: null,
        sortFn: (a: PRODUCT, b: PRODUCT) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    }
]

export {
    PRODUCT,
    ProductColumns,
}