import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"
import {Type} from "./type"
import {Account} from "./account"

interface Transaction {
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

interface TransactionStatus {
    key: string
    value: string
}

interface TransactionColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<Transaction> | null
    sortDirections: NzTableSortOrder[]
    priority: number | boolean
    filters?: NzTableFilterList,
    filterFn?: NzTableFilterFn<Transaction> | null,
    filterMultiple?: boolean
}

export {
    Transaction,
    TransactionStatus,
    TransactionColumnItem
}