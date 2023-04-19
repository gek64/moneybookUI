import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {environment} from "../environment/environment"
import {Invoice} from "../interface/invoice"

@Injectable()
export class InvoiceService {
    constructor(private http: HttpClient) {
    }

    createInvoice(newInvoice: Invoice) {
        return this.http.post<Invoice>(new URL("/invoice", environment.backend_server).toString(), newInvoice)
    }

    updateInvoice(updateInvoice: Invoice) {
        return this.http.put<Invoice>(new URL("/invoice", environment.backend_server).toString(), updateInvoice)
    }

    patchManyInvoicesStatus(ids: string[], status: string) {
        return this.http.patch<{
            count: number
        }>(new URL("/invoice/many/status", environment.backend_server).toString(), {
            ids: ids,
            status: status
        })
    }

    getInvoiceById(id: string) {
        return this.http.get<Invoice>(new URL("/invoice", environment.backend_server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getAllInvoices() {
        return this.http.get<Invoice[]>(new URL("/invoice/all", environment.backend_server).toString())
    }

    getInvoicesPagination(skip: number, take: number) {
        return this.http.get<Invoice[]>(new URL("/invoice/pagination", environment.backend_server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getInvoicesFuzzy(key: string) {
        return this.http.get<Invoice[]>(new URL("/invoice/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getInvoicesPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Invoice[]>(new URL("/invoice/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteManyInvoices(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/invoice/many", environment.backend_server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}