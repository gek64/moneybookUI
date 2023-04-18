import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {environment} from "../environment/environment"
import {Account} from "../interface/account"

@Injectable()
export class AccountService {
    constructor(private http: HttpClient) {
    }

    createAccount(newAccount: Account) {
        return this.http.post<Account>(new URL("/account", environment.backend_server).toString(), newAccount)
    }

    updateAccount(updateAccount: Account) {
        return this.http.put<Account>(new URL("/account", environment.backend_server).toString(), updateAccount)
    }

    getAccountById(id: string) {
        return this.http.get<Account>(new URL("/account", environment.backend_server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getAllAccounts() {
        return this.http.get<Account[]>(new URL("/account/all", environment.backend_server).toString())
    }

    getAccountsPagination(skip: number, take: number) {
        return this.http.get<Account[]>(new URL("/account/pagination", environment.backend_server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getAccountsFuzzy(key: string) {
        return this.http.get<Account[]>(new URL("/account/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getAccountsPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Account[]>(new URL("/account/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteManyAccounts(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/account/many", environment.backend_server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}