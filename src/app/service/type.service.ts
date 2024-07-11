import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {TYPE} from "../share/definition/type"
import {environment} from "../app.component"

@Injectable()
export class TypeService {
    server = environment.server

    constructor(private http: HttpClient) {
    }

    createType(newType: TYPE) {
        return this.http.post<TYPE>(new URL("/type", this.server).toString(), newType)
    }

    updateType(updateType: TYPE) {
        return this.http.put<TYPE>(new URL("/type", this.server).toString(), updateType)
    }

    getTypes() {
        return this.http.get<TYPE[]>(new URL("/types", this.server).toString())
    }

    deleteType(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/type", this.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteTypes(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/types", this.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}