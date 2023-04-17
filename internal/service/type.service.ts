import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {Type} from "../interface/type"
import {environment} from "../environment/environment"

@Injectable()
export class TypeService {
    constructor(private http: HttpClient) {
    }

    createType(newType: Type) {
        return this.http.post<any>(new URL("/type", environment.backend_server).toString(), newType)
    }

    getTypeById(id: string) {
        return this.http.get<Type[]>(new URL("/type", environment.backend_server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getAllType() {
        return this.http.get<Type[]>(new URL("/type/all", environment.backend_server).toString())
    }

    getTypesPagination(skip: number, take: number) {
        return this.http.get<Type[]>(new URL("/type/pagination", environment.backend_server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getTypesFuzzy(key: string) {
        return this.http.get<Type[]>(new URL("/type/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getTypesPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Type[]>(new URL("/type/fuzzy", environment.backend_server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteManyType(ids: Set<string>) {
        return this.http.delete<any>(new URL("/type/many", environment.backend_server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}