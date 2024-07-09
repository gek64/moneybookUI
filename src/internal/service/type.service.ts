import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {Type} from "../interface/type"
import {environment} from "../environment/environment"

@Injectable()
export class TypeService {
    constructor(private http: HttpClient) {
    }

    createType(newType: Type) {
        return this.http.post<Type>(new URL("/type", environment.server).toString(), newType)
    }

    updateType(updateType: Type) {
        return this.http.put<Type>(new URL("/type", environment.server).toString(), updateType)
    }

    getTypeById(id: string) {
        return this.http.get<Type>(new URL("/type", environment.server).toString(), {
            params: {
                "id": id
            }
        })
    }

    getAllTypes() {
        return this.http.get<Type[]>(new URL("/types", environment.server).toString())
    }

    getTypesPagination(skip: number, take: number) {
        return this.http.get<Type[]>(new URL("/types/pagination", environment.server).toString(), {
            params: {
                "skip": skip,
                "take": take
            }
        })
    }

    getTypesFuzzy(key: string) {
        return this.http.get<Type[]>(new URL("/types/fuzzy", environment.server).toString(), {
            params: {
                "key": key
            }
        })
    }

    getTypesPaginationAndFuzzy(key: string, skip: number, take: number) {
        return this.http.get<Type[]>(new URL("/types/paginationAndFuzzy", environment.server).toString(), {
            params: {
                "key": key,
                "skip": skip,
                "take": take
            }
        })
    }

    deleteType(id: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/type", environment.server).toString(), {
            params: {
                "id": Array.from(id)
            }
        })
    }

    deleteManyTypes(ids: Set<string>) {
        return this.http.delete<{ count: number }>(new URL("/types", environment.server).toString(), {
            params: {
                "ids": Array.from(ids)
            }
        })
    }
}