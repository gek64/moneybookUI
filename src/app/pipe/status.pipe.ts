import {Pipe, PipeTransform} from "@angular/core"
import {TransactionStatus} from "../share/definition/transactionStatus"

@Pipe({
    name: "status"
})
export class StatusPipe implements PipeTransform {
    transform($status: string): string {
        for (const t of TransactionStatus) {
            if ($status == t.value) {
                return t.key
            }
        }
        return $status
    }
}
