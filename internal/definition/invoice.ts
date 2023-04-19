import {Invoice, InvoiceColumnItem} from "../interface/invoice"


let InvoiceStatus = [
    {
        key: "已完成",
        value: "FINISHED"
    },
    {
        key: "未完成",
        value: "UNFINISHED"
    }
]

let InvoiceColumns: InvoiceColumnItem[] = [
    {
        name: "Title",
        sortOrder: null,
        sortFn: (a: Invoice, b: Invoice) => a.title.localeCompare(b.title),
        sortDirections: ["ascend", "descend", null],
        priority: false
    },
    {
        name: "Type",
        sortOrder: null,
        sortFn: (a: Invoice, b: Invoice) => a.type.name.localeCompare(b.type.name),
        sortDirections: ["ascend", "descend", null],
        priority: false,
    },
    {
        name: "Account",
        sortOrder: null,
        sortFn: (a: Invoice, b: Invoice) => a.account.name.localeCompare(b.account.name),
        sortDirections: ["ascend", "descend", null],
        priority: false
    },
    {
        name: "Amount",
        sortOrder: null,
        sortFn: (a: Invoice, b: Invoice) => a.amount - b.amount,
        sortDirections: ["ascend", "descend", null],
        priority: 1
    },
    {
        name: "Datetime",
        sortOrder: "descend",
        sortFn(a: Invoice, b: Invoice) {
            return a.datetime.getTime() - b.datetime.getTime()
        },
        sortDirections: ["ascend", "descend", null],
        priority: 2
    },
    {
        name: "Status",
        sortOrder: null,
        sortFn: (a: Invoice, b: Invoice) => {
            let string1: string, string2: string
            if (a.status == null) {
                string1 = ""
            } else {
                string1 = a.status
            }
            if (b.status == null) {
                string2 = ""
            } else {
                string2 = b.status
            }
            return string1.localeCompare(string2)
        },
        sortDirections: ["ascend", "descend", null],
        priority: 3
    }
]

export {
    InvoiceStatus,
    InvoiceColumns
}