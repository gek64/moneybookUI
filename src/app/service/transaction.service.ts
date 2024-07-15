import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {TRANSACTION, TRANSACTION_INPUT, TRANSACTION_OUTPUT} from "../share/definition/transaction"
import {environment} from "../app.component"

@Injectable()
export class TransactionService {
    server = environment.server

    constructor(private http: HttpClient) {
    }

    createTransaction(t: TRANSACTION_INPUT) {
        return this.http.post<TRANSACTION>(new URL("/transaction", this.server).toString(), t)
    }

    updateTransaction(t: TRANSACTION_INPUT) {
        return this.http.put<TRANSACTION>(new URL("/transaction", this.server).toString(), t)
    }

    patchTransactionsStatus(ids: string[], status: string) {
        return this.http.patch<{
            count: number
        }>(new URL("/transactions/status", this.server).toString(), {
            ids: ids,
            status: status
        })
    }

    readTransaction(id: string) {
        return this.http.get<TRANSACTION_OUTPUT>(new URL("/transaction", this.server).toString(), {
            params: {
                "id": id
            }
        })
    }

    readTransactions() {
        return this.http.get<TRANSACTION_OUTPUT[]>(new URL("/transactions", this.server).toString())
    }

    deleteTransaction(id: string) {
        return this.http.delete<{ count: number }>(new URL("/transaction", this.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteTransactions(ids: string[]) {
        return this.http.delete<{ count: number }>(new URL("/transactions", this.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}