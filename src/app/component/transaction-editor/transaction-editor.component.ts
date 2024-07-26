import {Component, EventEmitter, OnInit, Output} from "@angular/core"
import {TypeService} from "../../service/type.service"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {NzMessageService} from "ng-zorro-antd/message"
import {AccountService} from "../../service/account.service"
import {TRANSACTION_INPUT, TRANSACTION_OUTPUT} from "../../share/definition/transaction"
import {PRODUCT} from "../../share/definition/product"
import {ACCOUNT} from "../../share/definition/account"
import {TYPE} from "../../share/definition/type"
import {TransactionStatus} from "../../share/definition/transactionStatus"
import {ProductService} from "../../service/product.service"

@Component({
    selector: "app-component-transaction-editor",
    templateUrl: "./transaction-editor.component.html",
    styleUrls: ["./transaction-editor.component.css"]
})
export class TransactionEditorComponent implements OnInit {
    products: PRODUCT[] = []
    accounts: ACCOUNT[] = []
    types: TYPE[] = []
    status = TransactionStatus
    selectedProduct: PRODUCT[]
    selectedAccount: ACCOUNT
    selectedType: TYPE
    isVisible = false
    title = ""
    newTransaction: TRANSACTION_INPUT = {
        account: undefined,
        accountId: undefined,
        amount: undefined,
        datetime: new Date(Date.now()),
        id: undefined,
        productIds: [],
        status: undefined,
        title: undefined,
        type: undefined,
        typeId: undefined
    }
    @Output() editorResult = new EventEmitter()

    constructor(private productService: ProductService, private accountService: AccountService, private typeService: TypeService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.getProducts()
        this.getTypes()
        this.readAccounts()
    }

    nzSelectCompareFn(o1: any, o2: any) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2
    }

    getProducts() {
        let pageThis = this
        const req = this.productService.readProducts()
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                pageThis.products = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        })
    }

    getTypes() {
        let pageThis = this
        const req = this.typeService.readTypes()
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

    async readAccounts() {
        await this.accountService.readAccounts()
            .then(as => this.accounts = [...as])
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
    }

    showModal(t?: TRANSACTION_OUTPUT): void {
        if (t != undefined) {
            this.title = "Edit"
            this.newTransaction = Object.assign(this.newTransaction, t)
            this.selectedProduct = t.ProductOnTransaction.map(p => p.product)
            this.selectedType = t.type
            this.selectedAccount = t.account
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
            this.selectedProduct = []
            this.selectedType = null
            this.selectedAccount = null
        }
        this.isVisible = true
    }

    handleOk(): void {
        this.newTransaction.type = this.selectedType
        this.newTransaction.typeId = this.selectedType.id
        this.newTransaction.account = this.selectedAccount
        this.newTransaction.accountId = this.selectedAccount.id
        this.newTransaction.productIds = this.selectedProduct.map(p => p.id)

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
