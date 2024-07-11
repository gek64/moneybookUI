import {Pipe, PipeTransform} from "@angular/core"
import {TRANSACTION_STATUS, TransactionStatus} from "../share/definition/transactionStatus"

@Pipe({
    name: "status"
})
export class StatusPipe implements PipeTransform {
    transform(value: string, args?: TRANSACTION_STATUS[]): string {
        let transactionStatuses: TRANSACTION_STATUS[]

        if (args != undefined) {
            transactionStatuses = args
        } else {
            transactionStatuses = TransactionStatus
        }
        for (const i of transactionStatuses) {
            if (i.value == value) {
                return i.key
            }
        }

        return value
    }
}
