import {Component} from "@angular/core"
import {HttpErrorResponse} from "@angular/common/http"
import {Type} from "../../internal/interface/type"
import {catchError, retry, throwError} from "rxjs"
import {NzMessageService} from "ng-zorro-antd/message"
import {TypeService} from "../../internal/service/type.service"

@Component({
    selector: "app-type",
    templateUrl: "./type.component.html",
    styleUrls: ["./type.component.css"]
})
export class TypeComponent {
    loading: boolean = false
    types: Type[] = []

    constructor(private service: TypeService, private message: NzMessageService) {
    }

    ngOnInit() {
        this.getTypes()
    }

    private handleError(error: HttpErrorResponse) {
        let err: string
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            err = `Network error occurred, Message: ${error.message}`
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            err = `Backend returned code ${error.status}, Message: ${error.message}`
        }

        // Return an observable with a user-facing error message.
        return throwError(() => new Error(err))
    }

    getTypes(): void {
        let pageThis = this
        this.loading = true

        const req = this.service.getTypesPagination(0, 1000)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                pageThis.types = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }
}
