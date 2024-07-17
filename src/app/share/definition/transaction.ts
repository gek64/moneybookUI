import {TYPE} from "./type"
import {ACCOUNT} from "./account"
import {PRODUCT} from "./product"
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"

interface TRANSACTION {
    id: string
    title: string
    type: TYPE
    typeId: string
    account: ACCOUNT
    accountId: string
    amount: number
    datetime?: Date
    status?: string
}

interface TRANSACTION_INPUT extends TRANSACTION {
    productIds?: string[]
}

interface TRANSACTION_OUTPUT extends TRANSACTION {
    ProductOnTransaction?: { product: PRODUCT }[]
}

interface transaction_table_header {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<TRANSACTION> | null
    sortDirections: NzTableSortOrder[]
    priority: number | boolean
    filters?: NzTableFilterList,
    filterFn?: NzTableFilterFn<TRANSACTION> | null,
    filterMultiple?: boolean
}

let TransactionTableHeaders: transaction_table_header[] = [
    {
        name: "标题",
        sortOrder: null,
        sortFn: (a: TRANSACTION, b: TRANSACTION) => a.title.localeCompare(b.title),
        sortDirections: ["ascend", "descend", null],
        priority: false
    },
    {
        name: "类型",
        sortOrder: null,
        sortFn: (a: TRANSACTION, b: TRANSACTION) => a.type.name.localeCompare(b.type.name),
        sortDirections: ["ascend", "descend", null],
        priority: false,
    },
    {
        name: "账户",
        sortOrder: null,
        sortFn: (a: TRANSACTION, b: TRANSACTION) => a.account.name.localeCompare(b.account.name),
        sortDirections: ["ascend", "descend", null],
        priority: false
    },
    {
        name: "金额",
        sortOrder: null,
        sortFn: (a: TRANSACTION, b: TRANSACTION) => a.amount - b.amount,
        sortDirections: ["ascend", "descend", null],
        priority: 1
    },
    {
        name: "日期",
        sortOrder: "descend",
        sortFn(a: TRANSACTION, b: TRANSACTION) {
            return a.datetime.getTime() - b.datetime.getTime()
        },
        sortDirections: ["ascend", "descend", null],
        priority: 2
    },
    {
        name: "状态",
        sortOrder: null,
        sortFn: (a: TRANSACTION, b: TRANSACTION) => {
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
    TRANSACTION,
    TRANSACTION_INPUT,
    TRANSACTION_OUTPUT,
    TransactionTableHeaders
}