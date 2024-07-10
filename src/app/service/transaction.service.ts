import {Injectable, isDevMode} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {environmentDev} from "../../environments/environment.dev"

import {TRANSACTION} from "../share/definition/transaction"
import {environmentProd} from "../../environments/environment.prod"
import {environment} from "../../environments/environment"

@Injectable()
export class TransactionService {
    server = environment.server

    constructor(private http: HttpClient) {
    }

    createTransaction(newTransaction: TRANSACTION) {
        return this.http.post<TRANSACTION>(new URL("/transaction", this.server).toString(), newTransaction)
    }

    updateTransaction(updateTransaction: TRANSACTION) {
        return this.http.put<TRANSACTION>(new URL("/transaction", this.server).toString(), updateTransaction)
    }

    patchTransactionsStatus(ids: string[], status: string) {
        return this.http.patch<{
            count: number
        }>(new URL("/transactions/status", this.server).toString(), {
            ids: ids,
            status: status
        })
    }

    getTransaction(id: string) {
        return this.http.get<TRANSACTION>(new URL("/transaction", this.server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getTransactions() {
        return this.http.get<TRANSACTION[]>(new URL("/transactions", this.server).toString())
    }

    deleteTransaction(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/transaction", this.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteTransactions(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/transactions", this.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}