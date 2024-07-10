import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {ACCOUNT} from "../share/definition/account"
import {environment} from "../app.component"

@Injectable()
export class AccountService {
    server = environment.server

    constructor(private http: HttpClient) {
    }

    createAccount(newAccount: ACCOUNT) {
        return this.http.post<ACCOUNT>(new URL("/account", this.server).toString(), newAccount)
    }

    updateAccount(updateAccount: ACCOUNT) {
        return this.http.put<ACCOUNT>(new URL("/account", this.server).toString(), updateAccount)
    }

    getAllAccounts() {
        return this.http.get<ACCOUNT[]>(new URL("/accounts", this.server).toString())
    }

    deleteAccount(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/account", this.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteAccounts(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/accounts", this.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}