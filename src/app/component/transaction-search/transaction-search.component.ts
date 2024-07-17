import {Component, OnInit, ViewChild} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {TransactionStatus} from "../../share/definition/transactionStatus"
import {EndOfDay, EndOfMonth, EndOfYear, StartOfDay, StartOfMonth, StartOfYear} from "../../share/date/dataRange"
import {
    TRANSACTION,
    TRANSACTION_INPUT,
    TRANSACTION_OUTPUT,
    TransactionTableHeaders
} from "../../share/definition/transaction"
import {TransactionEditorComponent} from "../transaction-editor/transaction-editor.component"
import {PRODUCT} from "../../share/definition/product"
import {TYPE} from "../../share/definition/type"
import {ACCOUNT} from "../../share/definition/account"
import {TransactionService} from "../../service/transaction.service"
import {ProductService} from "../../service/product.service"
import {TypeService} from "../../service/type.service"
import {AccountService} from "../../service/account.service"

@Component({
    selector: "app-component-transaction-search",
    templateUrl: "./transaction-search.component.html",
    styleUrls: ["./transaction-search.component.css"]
})
export class TransactionSearchComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: TransactionEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly TRANSACTION_OUTPUT[] = []
    listOfCurrentPageData: readonly TRANSACTION_OUTPUT[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = TransactionTableHeaders
    allTransactions: readonly TRANSACTION_OUTPUT[] = []
    allProducts: readonly PRODUCT[] = []
    allTypes: readonly  TYPE[] = []
    allAccounts: readonly  ACCOUNT[] = []
    allStatus: { key: string, value: string }[] = TransactionStatus
    selectedKeyword: string = ""
    selectedProducts: PRODUCT[] = []
    selectedTypes: TYPE[] = []
    selectedAccounts: ACCOUNT[] = []
    selectedStatus: { key: string, value: string }[] = []
    selectedDatetime: Date[] = []
    selectedAmount: number = 0

    DefinedDateRanges = {
        "Today": [StartOfDay(new Date()), EndOfDay(new Date())],
        "This Month": [StartOfMonth(new Date()), EndOfMonth(new Date())],
        "This Year": [StartOfYear(new Date()), EndOfYear(new Date())]
    }

    constructor(private transactionService: TransactionService, private productService: ProductService, private accountService: AccountService, private typeService: TypeService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        // 使用客户端筛选时才需要
        // this.readTransactions()
        this.readProducts()
        this.readTypes()
        this.readAccounts()
    }

    // 数据库操作
    updateStatus(status: string) {
        let pageThis = this
        this.loading = true

        this.transactionService.patchTransactionsStatus(Array.from(this.setOfCheckedItems), status)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    if (resp.count != undefined && resp.count != 0) {
                        pageThis.listOfData.forEach(function (transaction, index, array) {
                            pageThis.setOfCheckedItems.forEach(function (selectedId) {
                                if (transaction.id == selectedId) {
                                    array[index].status = status
                                }
                            })
                        })
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    updateTransaction(t: TRANSACTION_INPUT) {
        this.loading = true

        this.transactionService.updateTransaction(t)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp: TRANSACTION) => {
                    if (resp.id !== undefined) {
                        this.readTransactions()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    deleteTransactions() {
        this.loading = true

        this.transactionService.deleteTransactions([...this.setOfCheckedItems])
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: resp => {
                    if (resp.count > 0) {
                        this.listOfData = this.listOfData.filter(item => !this.setOfCheckedItems.has(item.id))
                        this.setOfCheckedItems.clear()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    readTransactions() {
        let pageThis = this
        this.loading = true

        this.transactionService.readTransactions()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: function (resp) {
                    resp.forEach(function (transaction, index) {
                        resp[index].datetime = new Date(Date.parse(transaction.datetime as unknown as string))
                    })
                    pageThis.allTransactions = resp
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    readProducts() {
        this.productService.readProducts()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    this.allProducts = resp
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
    }

    readTypes() {
        this.typeService.readTypes()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    this.allTypes = resp
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
    }

    readAccounts() {
        this.accountService.readAccounts()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    this.allAccounts = resp
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
    }

    // 中间功能
    getEditorResult(e: TRANSACTION_INPUT) {
        if (e.id !== undefined) {
            this.updateTransaction(e)
        }
    }

    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly TRANSACTION_OUTPUT[]) {
        this.listOfCurrentPageData = listOfCurrentPageData
        this.refreshCheckedAllStatus()
    }

    updateCheckedSet(id: string, checked: boolean) {
        if (checked) {
            this.setOfCheckedItems.add(id)
        } else {
            this.setOfCheckedItems.delete(id)
        }
    }

    // 按键
    submitButton() {
        // 服务端筛选
        this.selectedAmount = 0
        this.transactionService.readTransactionsWithConditions(undefined, this.selectedKeyword, this.selectedProducts?.map(p => p.id), this.selectedTypes?.map(t => t.id), this.selectedAccounts?.map(a => a.id), this.selectedDatetime[0]?.toString(), this?.selectedDatetime[1]?.toString(), this.selectedStatus?.map(s => s.value))
            .pipe(retry(1), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    this.listOfData = resp

                    // 统计金额
                    this.listOfData.forEach((transaction, index) => {
                        this.listOfData[index].datetime = new Date(this.listOfData[index].datetime)
                        this.selectedAmount += transaction.amount
                    })
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)

        // 客户端筛选
        // this.listOfData = this.allTransactions.filter((transaction) => {
        //     let isProduct: boolean, isType: boolean, isAccount: boolean, isStatus: boolean, isDatetime: boolean
        //
        //     if (this.selectedProducts.length == 0) {
        //         isProduct = true
        //     } else {
        //         isProduct = transaction.ProductOnTransaction.map(p => p.product.id).some(id => this.selectedProducts.some(product => product.id == id))
        //     }
        //
        //     if (this.selectedTypes.length == 0) {
        //         isType = true
        //     } else {
        //         isType = this.selectedTypes.some((type) => type.id == transaction.typeId)
        //     }
        //
        //     if (this.selectedAccounts.length == 0) {
        //         isAccount = true
        //     } else {
        //         isAccount = this.selectedAccounts.some((account) => account.id == transaction.accountId)
        //     }
        //
        //     if (this.selectedStatus.length == 0) {
        //         isStatus = true
        //     } else {
        //         isStatus = this.selectedStatus.some((status) => status.value == transaction.status)
        //     }
        //
        //     if (this.selectedDatetime.length < 2) {
        //         isDatetime = true
        //     } else {
        //         // 将日期选择器的时间毫秒位设置为0
        //         let time1 = new Date(this.selectedDatetime[0].setMilliseconds(0))
        //         let time2 = new Date(this.selectedDatetime[1].setMilliseconds(0))
        //         isDatetime = time1 <= transaction.datetime && transaction.datetime <= time2
        //     }
        //     return isProduct && isType && isAccount && isStatus && isDatetime
        // })
        //
        // this.selectedAmount = 0
        // this.listOfData.forEach((transaction, index) => {
        //     this.selectedAmount += transaction.amount
        // })
    }

    editTypeButton() {
        let ts = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (ts.length === 1) {
            this.editor.showModal(ts[0])
        }
    }

    onItemChecked(id: string, checked: boolean) {
        this.updateCheckedSet(id, checked)
        this.refreshCheckedAllStatus()
    }

    onAllChecked(checked: boolean) {
        this.listOfCurrentPageData
            .forEach(({id}) => this.updateCheckedSet(id, checked))
        this.refreshCheckedAllStatus()
    }

    clearSetOfCheckedItemsButton() {
        this.setOfCheckedItems.clear()
        this.refreshCheckedAllStatus()
    }

    selectAllItemsButton() {
        this.listOfData.forEach(t => this.setOfCheckedItems.add(t.id))
        this.refreshCheckedAllStatus()
    }

    isProductNotSelected(value: PRODUCT): boolean {
        return this.selectedProducts.indexOf(value) === -1
    }

    isTypeNotSelected(value: TYPE): boolean {
        return this.selectedTypes.indexOf(value) === -1
    }

    isAccountNotSelected(value: ACCOUNT): boolean {
        return this.selectedAccounts.indexOf(value) === -1
    }

    isStatusNotSelected(value: { key: string, value: string }): boolean {
        return this.selectedStatus.indexOf(value) === -1
    }

    // 网络请求
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