import {Component, EventEmitter, OnInit, Output} from "@angular/core"
import {TypeService} from "../../../../service/type.service"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {NzMessageService} from "ng-zorro-antd/message"
import {AccountService} from "../../../../service/account.service"
import {TRANSACTION} from "../../../../share/definition/transaction"
import {ACCOUNT} from "../../../../share/definition/account"
import {TYPE} from "../../../../share/definition/type"
import {TransactionStatus} from "../../../../share/definition/transactionStatus"


@Component({
    selector: "app-table-transaction-editor",
    templateUrl: "./transaction-editor.component.html",
    styleUrls: ["./transaction-editor.component.css"]
})
export class TransactionEditorComponent implements OnInit {
    accounts: ACCOUNT[] = []
    types: TYPE[] = []
    status = TransactionStatus
    selectedAccount: ACCOUNT
    selectedType: TYPE

    isVisible = false
    title = ""
    newTransaction = new class implements TRANSACTION {
        account: ACCOUNT
        accountId: string
        amount: number
        datetime?: Date
        id: string
        status?: string
        title: string
        type: TYPE
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

    showModal(newTransaction?: TRANSACTION): void {
        if (newTransaction != undefined) {
            this.title = "Edit"

            // 使用 this.newX = newX是引用赋值
            // 值赋值
            // this.newX.id = newX.id
            // this.newX.name = newX.name
            Object.assign(this.newTransaction, newTransaction)
            this.selectedAccount = newTransaction.account
            this.selectedType = newTransaction.type
        } else {
            this.title = "Create"
            this.newTransaction.id = undefined
            this.newTransaction.title = undefined
            this.newTransaction.typeId = undefined
            this.newTransaction.type = undefined
            this.newTransaction.accountId = undefined
            this.newTransaction.account = undefined
            this.newTransaction.amount = undefined
            this.newTransaction.datetime = new Date(Date.now())
            this.newTransaction.status = undefined
            this.selectedAccount = null
            this.selectedType = null
        }
        this.isVisible = true
    }

    handleOk(): void {
        // 选择器赋值到返回的结果
        this.newTransaction.account = this.selectedAccount
        this.newTransaction.accountId = this.selectedAccount.id
        this.newTransaction.type = this.selectedType
        this.newTransaction.typeId = this.selectedType.id

        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.newTransaction)
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
