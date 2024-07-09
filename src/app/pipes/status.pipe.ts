import {Pipe, PipeTransform} from "@angular/core"
import {TransactionStatus} from "../../internal/definition/transaction"

@Pipe({
    name: "status"
})
export class StatusPipe implements PipeTransform {
    transform(value: string, args?: TransactionStatus[]): string {
        let transactionStatuses: TransactionStatus[] = []

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
