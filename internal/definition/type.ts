import {Type, TypeColumnItem} from "../interface/type"

let TypeColumns: TypeColumnItem[] = [
    {
        name: "Name",
        sortOrder: null,
        sortFn: (a: Type, b: Type) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    }
]

export {
    TypeColumns
}