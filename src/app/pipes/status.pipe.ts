import {Pipe, PipeTransform} from "@angular/core"
import {InvoiceStatus} from "../../internal/definition/invoice"

@Pipe({
    name: "status"
})
export class StatusPipe implements PipeTransform {
    transform(value: string, args?: InvoiceStatus[]): string {
        let invoiceStatus: InvoiceStatus[] = []

        if (args != undefined) {
            invoiceStatus = args
        } else {
            invoiceStatus = InvoiceStatus
        }
        for (const i of invoiceStatus) {
            if (i.value == value) {
                return i.key
            }
        }

        return value
    }
}
