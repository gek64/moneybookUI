import {NzTableSortFn, NzTableSortOrder} from "ng-zorro-antd/table"

interface Account {
    id: string
    name: string
    number?: string
    type: string
    funds?: number
}

interface AccountColumnItem {
    name: string
    sortOrder: NzTableSortOrder | null
    sortFn: NzTableSortFn<Account> | null
    sortDirections: NzTableSortOrder[]
}

export {
    Account,
    AccountColumnItem
}