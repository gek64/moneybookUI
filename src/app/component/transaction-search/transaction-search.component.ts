import {Component, OnInit} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {TransactionStatus} from "../../share/definition/transactionStatus"
import {EndOfDay, EndOfMonth, EndOfYear, StartOfDay, StartOfMonth, StartOfYear} from "../../share/date/dataRange"
import {TRANSACTION_OUTPUT, TransactionColumns} from "../../share/definition/transaction"
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
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly TRANSACTION_OUTPUT[] = []
    listOfCurrentPageData: readonly TRANSACTION_OUTPUT[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = TransactionColumns
    allTransactions: readonly TRANSACTION_OUTPUT[] = []
    allProducts: readonly PRODUCT[] = []
    allTypes: readonly  TYPE[] = []
    allAccounts: readonly  ACCOUNT[] = []
    allStatus: { key: string, value: string }[] = TransactionStatus
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
        this.readTransactions()
        this.readProducts()
        this.readTypes()
        this.readAccounts()
    }

    // 中间功能
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
        let pageThis = this
        this.listOfData = this.allTransactions.filter((transaction) => {
            let isProduct: boolean, isType: boolean, isAccount: boolean, isStatus: boolean, isDatetime: boolean

            if (pageThis.selectedProducts.length == 0) {
                isProduct = true
            } else {
                isProduct = pageThis.selectedProducts.some((product) => {
                    console.log(transaction.ProductOnTransaction?.length != 0)
                })
            }

            if (pageThis.selectedTypes.length == 0) {
                isType = true
            } else {
                isType = pageThis.selectedTypes.some((type) => type.id == transaction.typeId)
            }

            if (pageThis.selectedAccounts.length == 0) {
                isAccount = true
            } else {
                isAccount = pageThis.selectedAccounts.some((account) => account.id == transaction.accountId)
            }

            if (pageThis.selectedStatus.length == 0) {
                isStatus = true
            } else {
                isStatus = pageThis.selectedStatus.some((status) => status.value == transaction.status)
            }

            if (pageThis.selectedDatetime.length < 2) {
                isDatetime = true
            } else {
                // 将日期选择器的时间毫秒位设置为0
                let time1 = new Date(pageThis.selectedDatetime[0].setMilliseconds(0))
                let time2 = new Date(pageThis.selectedDatetime[1].setMilliseconds(0))
                isDatetime = time1 <= transaction.datetime && transaction.datetime <= time2
            }

            return isType && isAccount && isStatus && isDatetime
        })

        pageThis.selectedAmount = 0
        this.listOfData.forEach(function (transaction) {
            pageThis.selectedAmount += transaction.amount
        })
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