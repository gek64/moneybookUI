import {Account, AccountColumnItem} from "../interface/account"

let InvoiceColumns: AccountColumnItem[] = [
    {
        name: "名称",
        sortOrder: null,
        sortFn: (a: Account, b: Account) => a.name.localeCompare(b.name),
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "号码",
        sortOrder: null,
        sortFn: (a: Account, b: Account) => {
            let string1: string, string2: string
            if (a.number == null) {
                string1 = ""
            } else {
                string1 = a.number
            }
            if (b.number == null) {
                string2 = ""
            } else {
                string2 = b.number
            }
            return string1.localeCompare(string2)
        },
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "类型",
        sortOrder: null,
        sortFn: (a: Account, b: Account) => a.type.localeCompare(b.type),
        sortDirections: ["ascend", "descend", null]
    },
    {
        name: "资金",
        sortOrder: null,
        sortFn: (a: Account, b: Account) => {
            let number1: number, number2: number
            if (a.funds == null) {
                number1 = -1
            } else {
                number1 = a.funds
            }
            if (b.funds == null) {
                number2 = -1
            } else {
                number2 = b.funds
            }
            return number1 - number2
        },
        sortDirections: ["ascend", "descend", null]
    }
]

export {
    InvoiceColumns
}