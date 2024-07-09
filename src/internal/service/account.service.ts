import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {environment} from "../environment/environment"
import {Account} from "../interface/account"

@Injectable()
export class AccountService {
    constructor(private http: HttpClient) {
    }

    createAccount(newAccount: Account) {
        return this.http.post<Account>(new URL("/account", environment.server).toString(), newAccount)
    }

    updateAccount(updateAccount: Account) {
        return this.http.put<Account>(new URL("/account", environment.server).toString(), updateAccount)
    }

    getAccountById(id: string) {
        return this.http.get<Account>(new URL("/account", environment.server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getAllAccounts() {
        return this.http.get<Account[]>(new URL("/accounts", environment.server).toString())
    }

    getAccountsPagination(skip: number, take: number) {
        return this.http.get<Account[]>(new URL("/accounts/pagination", environment.server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getAccountsFuzzy(key: string) {
        return this.http.get<Account[]>(new URL("/accounts/fuzzy", environment.server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getAccountsPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Account[]>(new URL("/accounts/paginationAndFuzzy", environment.server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteAccount(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/account", environment.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteManyAccounts(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/accounts", environment.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}