import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {PRODUCT} from "../share/definition/product"
import {environment} from "../app.component"
import {lastValueFrom, retry} from "rxjs"

@Injectable()
export class ProductService {
    url1 = new URL("/product", environment.server).toString()
    url2 = new URL("/products", environment.server).toString()

    constructor(private http: HttpClient) {
    }

    async createProduct(productBody: PRODUCT) {
        return await lastValueFrom(this.http.post<PRODUCT>(this.url1, productBody).pipe(retry(3)))
            .then(a => a)
            .catch(error => Promise.reject(error))
    }

    async updateProduct(productBody: PRODUCT) {
        return await lastValueFrom(this.http.put<PRODUCT>(this.url1, productBody).pipe(retry(3)))
            .then(a => a)
            .catch(error => Promise.reject(error))
    }

    async deleteProducts(ids: Set<string>) {
        return await lastValueFrom(this.http.delete<{ count: number }>
        (this.url2, {params: {"ids": Array.from(ids)}}).pipe(retry(3)))
            .then(resp => resp)
            .catch(error => Promise.reject(error))
    }

    async readProducts() {
        return await lastValueFrom(this.http.get<PRODUCT[]>(this.url2).pipe(retry(3)))
            .then(as => as)
            .catch(error => Promise.reject(error))
    }
}