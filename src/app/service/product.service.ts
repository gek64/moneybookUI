import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {PRODUCT} from "../share/definition/product"
import {environment} from "../app.component"

@Injectable()
export class ProductService {
    server = environment.server

    constructor(private http: HttpClient) {
    }

    createProduct(newProduct: PRODUCT) {
        return this.http.post<PRODUCT>(new URL("/product", this.server).toString(), newProduct)
    }

    updateProduct(updateProduct: PRODUCT) {
        return this.http.put<PRODUCT>(new URL("/product", this.server).toString(), updateProduct)
    }

    getProducts() {
        return this.http.get<PRODUCT[]>(new URL("/products", this.server).toString())
    }

    deleteProduct(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/product", this.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteProducts(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/products", this.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}