import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {lastValueFrom, retry} from "rxjs"
import {ACCOUNT} from "../share/definition/account"
import {environment} from "../app.component"


@Injectable()
export class AccountService {
    url1 = new URL("/account", environment.server).toString()
    url2 = new URL("/accounts", environment.server).toString()

    constructor(private http: HttpClient) {
    }

    async createAccount(accountBody: ACCOUNT) {
        return await lastValueFrom(this.http.post<ACCOUNT>(this.url1, accountBody).pipe(retry(3)))
            .then(a => a)
            .catch(error => Promise.reject(error))
    }

    async updateAccount(accountBody: ACCOUNT) {
        return await lastValueFrom(this.http.put<ACCOUNT>(this.url1, accountBody).pipe(retry(3)))
            .then(a => a)
            .catch(error => Promise.reject(error))
    }

    async readAccounts() {
        return await lastValueFrom(this.http.get<ACCOUNT[]>(this.url2).pipe(retry(3)))
            .then(a => a)
            .catch(error => Promise.reject(error))
    }

    async deleteAccounts(ids: Set<string>) {
        return await lastValueFrom(this.http.delete<{ count: number }>
        (this.url2, {params: {"ids": Array.from(ids)}}).pipe(retry(3)))
            .then(resp => resp)
            .catch(error => Promise.reject(error))
    }
}