import {Component, EventEmitter, OnInit, Output} from "@angular/core"
import {TypeService} from "../../service/type.service"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {NzMessageService} from "ng-zorro-antd/message"
import {AccountService} from "../../service/account.service"
import {TRANSACTION} from "../../share/definition/transaction"
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
    selectedProduct: PRODUCT
    selectedAccount: ACCOUNT
    selectedType: TYPE
    isVisible = false
    title = ""
    newTransaction = new class implements TRANSACTION {
        product?: PRODUCT
        productId?: string
        type: TYPE
        typeId: string
        account: ACCOUNT
        accountId: string
        amount: number
        datetime?: Date
        id: string
        status?: string
        title: string
    }
    @Output() editorResult = new EventEmitter()

    constructor(private productService: ProductService, private accountService: AccountService, private typeService: TypeService, private message: NzMessageService) {
    }

    ngOnInit(): void {
        this.getProducts()
        this.getTypes()
        this.getAccounts()
    }

    compareFn(o1: any, o2: any) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2
    }

    getProducts() {
        let pageThis = this
        const req = this.productService.getProducts()
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
        const req = this.typeService.getTypes()
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
        const req = this.accountService.getAccounts()
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
            this.selectedProduct = newTransaction.product
            this.selectedType = newTransaction.type
            this.selectedAccount = newTransaction.account
        } else {
            this.title = "Create"
            this.newTransaction.id = undefined
            this.newTransaction.title = undefined
            this.newTransaction.product = undefined
            this.newTransaction.productId = undefined
            this.newTransaction.typeId = undefined
            this.newTransaction.type = undefined
            this.newTransaction.accountId = undefined
            this.newTransaction.account = undefined
            this.newTransaction.amount = undefined
            this.newTransaction.datetime = new Date(Date.now())
            this.newTransaction.status = undefined
            this.selectedProduct = null
            this.selectedType = null
            this.selectedAccount = null
        }
        this.isVisible = true
    }

    handleOk(): void {
        this.newTransaction.product = this.selectedProduct
        // 可选链运算符 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining
        // 三元运算符 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Conditional_operator
        this.newTransaction.productId = this.selectedProduct == null ? null : this.selectedProduct?.id
        this.newTransaction.type = this.selectedType
        this.newTransaction.typeId = this.selectedType.id
        this.newTransaction.account = this.selectedAccount
        this.newTransaction.accountId = this.selectedAccount.id

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
