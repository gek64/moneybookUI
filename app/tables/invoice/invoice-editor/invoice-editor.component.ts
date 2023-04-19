import {Component, EventEmitter, OnInit, Output} from "@angular/core"
import {Invoice} from "../../../../internal/interface/invoice"
import {Account} from "../../../../internal/interface/account"
import {Type} from "../../../../internal/interface/type"
import {TypeService} from "../../../../internal/service/type.service"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {NzMessageService} from "ng-zorro-antd/message"
import {AccountService} from "../../../../internal/service/account.service"
import {InvoiceStatus} from "../../../../internal/definition/invoice"


@Component({
    selector: "app-table-invoice-editor",
    templateUrl: "./invoice-editor.component.html",
    styleUrls: ["./invoice-editor.component.css"]
})
export class InvoiceEditorComponent implements OnInit {
    accounts: Account[] = []
    types: Type[] = []
    status = InvoiceStatus
    selectedAccount: Account
    selectedType: Type

    isVisible = false
    title = ""
    newInvoice = new class implements Invoice {
        account: Account
        accountId: string
        amount: number
        datetime?: Date
        id: string
        status?: string
        title: string
        type: Type
        typeId: string
    }
    @Output() editorResult = new EventEmitter()

    constructor(private accountService: AccountService, private typeService: TypeService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.getTypes()
        this.getAccounts()
    }

    compareFn(o1: any, o2: any) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2
    }

    getTypes() {
        let pageThis = this
        const req = this.typeService.getAllTypes()
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
        })
    }

    getAccounts() {
        let pageThis = this
        const req = this.accountService.getAllAccounts()
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                pageThis.accounts = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        })
    }

    showModal(newInvoice?: Invoice): void {
        if (newInvoice != undefined) {
            this.title = "Edit"

            // 使用 this.newX = newX是引用赋值
            // 值赋值
            // this.newX.id = newX.id
            // this.newX.name = newX.name
            Object.assign(this.newInvoice, newInvoice)
            this.selectedAccount = newInvoice.account
            this.selectedType = newInvoice.type
        } else {
            this.title = "Create"
            this.newInvoice.id = undefined
            this.newInvoice.title = undefined
            this.newInvoice.typeId = undefined
            this.newInvoice.type = undefined
            this.newInvoice.accountId = undefined
            this.newInvoice.account = undefined
            this.newInvoice.amount = undefined
            this.newInvoice.datetime = new Date(Date.now())
            this.newInvoice.status = undefined
            this.selectedAccount = null
            this.selectedType = null
        }
        this.isVisible = true
    }

    handleOk(): void {
        // 选择器赋值到返回的结果
        this.newInvoice.account = this.selectedAccount
        this.newInvoice.accountId = this.selectedAccount.id
        this.newInvoice.type = this.selectedType
        this.newInvoice.typeId = this.selectedType.id

        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.newInvoice)
        this.isVisible = false
    }

    handleCancel(): void {
        this.isVisible = false
    }

    private handleError(error: HttpErrorResponse) {
        let err: string
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            err = `Network error occurred, Message: ${error.error}`
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            err = `Backend returned code ${error.status}, Message: ${error.error}`
        }
        // 控制台输出错误提示
        console.error(err)
        // Return an observable with a user-facing error message.
        return throwError(() => new Error(err))
    }
}
