import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"
import {Type} from "./type"
import {Account} from "./account"

interface Invoice {
    id: string
    title: string
    type: Type
    typeId: string
    account: Account
    accountId: string
    amount: number
    datetime?: Date
    status?: string
}

interface InvoiceStatus {
    key: string
    value: string
}

interface InvoiceColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<Invoice> | null
    sortDirections: NzTableSortOrder[]
    priority: number | boolean
    filters?: NzTableFilterList,
    filterFn?: NzTableFilterFn<Invoice> | null,
    filterMultiple?: boolean
}

export {
    Invoice,
    InvoiceStatus,
    InvoiceColumnItem
}