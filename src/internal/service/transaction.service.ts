import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {environment} from "../environment/environment"
import {Transaction} from "../interface/transaction"

@Injectable()
export class TransactionService {
    constructor(private http: HttpClient) {
    }

    createTransaction(newTransaction: Transaction) {
        return this.http.post<Transaction>(new URL("/transaction", environment.server).toString(), newTransaction)
    }

    updateTransaction(updateTransaction: Transaction) {
        return this.http.put<Transaction>(new URL("/transaction", environment.server).toString(), updateTransaction)
    }

    patchTransactionsStatus(ids: string[], status: string) {
        return this.http.patch<{
            count: number
        }>(new URL("/transactions/status", environment.server).toString(), {
            ids: ids,
            status: status
        })
    }

    getTransaction(id: string) {
        return this.http.get<Transaction>(new URL("/transaction", environment.server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getTransactions() {
        return this.http.get<Transaction[]>(new URL("/transactions", environment.server).toString())
    }

    getTransactionsPagination(skip: number, take: number) {
        return this.http.get<Transaction[]>(new URL("/transactions/pagination", environment.server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getTransactionsFuzzy(key: string) {
        return this.http.get<Transaction[]>(new URL("/transactions/fuzzy", environment.server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getTransactionsPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Transaction[]>(new URL("/transactions/paginationAndFuzzy", environment.server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteTransaction(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/transaction", environment.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteTransactions(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/transactions", environment.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}