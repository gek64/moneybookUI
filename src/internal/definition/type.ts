import {Type, TypeColumnItem} from "../interface/type"

let TypeColumns: TypeColumnItem[] = [
    {
        name: "名称",
        sortOrder: null,
        sortFn: (a: Type, b: Type) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    }
]

export {
    TypeColumns
}