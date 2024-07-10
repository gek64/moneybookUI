interface TRANSACTION_STATUS {
    key: string
    value: string
}

let TransactionStatus: TRANSACTION_STATUS[] = [
    {
        key: "已完成",
        value: "FINISHED"
    },
    {
        key: "未完成",
        value: "UNFINISHED"
    }
]
export {
    TRANSACTION_STATUS,
    TransactionStatus
}
