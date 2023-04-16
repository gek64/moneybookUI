import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {Type} from "../interface/type"
import {environment} from "../environment/environment"

@Injectable()
export class TypeService {
    constructor(private http: HttpClient) {
    }

    getTypeById(id: string) {
        return this.http.get<Type[]>(new URL("/type", environment.backend_server).toString(), {
            params: {
                "id": id
            }
        })
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
}