import {Component, OnInit, ViewChild} from "@angular/core"
import {TransactionService} from "../../service/transaction.service"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {TransactionEditorComponent} from "../transaction-editor/transaction-editor.component"
import {TRANSACTION, TransactionColumns} from "../../share/definition/transaction"


@Component({
    selector: "app-component-transaction",
    templateUrl: "./transaction.component.html",
    styleUrls: ["./transaction.component.css"]
})

export class TransactionComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: TransactionEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly TRANSACTION[] = []
    listOfCurrentPageData: readonly TRANSACTION[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = TransactionColumns

    constructor(private transactionService: TransactionService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.getTransactions()
    }

    // 中间功能
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly TRANSACTION[]) {
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

    getEditorResult(event: TRANSACTION) {
        let newTransaction: TRANSACTION = {
            product: undefined,
            productId: "",
            type: undefined,
            typeId: "",
            account: undefined,
            accountId: "",
            amount: 0,
            datetime: undefined,
            id: "",
            status: "",
            title: "",
        }
        Object.assign(newTransaction, event)

        if (newTransaction.id !== undefined) {
            this.updateTransaction(event)
        } else {
            this.createTransaction(event)
        }
    }

    // 按键
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
        this.checkedAll = false
        this.refreshCheckedAllStatus()
    }

    selectAllItemsButton() {
        this.listOfData.forEach(t => this.setOfCheckedItems.add(t.id))
        this.refreshCheckedAllStatus()
    }

    editTypeButton() {
        let transactions = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (transactions.length === 1) {
            this.editor.showModal(transactions[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
    }

    createTransaction(newTransaction: TRANSACTION) {
        let pageThis = this
        this.loading = true

        const req = this.transactionService.createTransaction(newTransaction)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    // 查询一遍新更改的值是否在数据库中存在
                    const req = pageThis.transactionService.getTransaction(resp.id)
                        .pipe(
                            retry(3),
                            catchError(pageThis.handleError)
                        )
                    req.subscribe({
                        next: function (resp) {
                            if (resp.id !== undefined) {
                                // 时间字符串变换为Date
                                resp.datetime = new Date(Date.parse(resp.datetime as unknown as string))
                                pageThis.listOfData = pageThis.listOfData.concat(resp)
                                pageThis.message.success("created successfully")
                            }
                        },
                        error: function (err: HttpErrorResponse) {
                            pageThis.message.error(err.message)
                        }
                    })
                }
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    updateTransaction(updateTransaction: TRANSACTION) {
        let pageThis = this
        this.loading = true

        const req = this.transactionService.updateTransaction(updateTransaction)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    const req = pageThis.transactionService.getTransaction(resp.id)
                        .pipe(
                            retry(3),
                            catchError(pageThis.handleError)
                        )
                    req.subscribe({
                        next: function (resp) {
                            pageThis.listOfData.forEach(function (transaction) {
                                if (transaction.id == resp.id) {
                                    // 先筛选出不含更改项的所有数据
                                    let newData = pageThis.listOfData.filter(item => item.id != resp.id)
                                    // 时间字符串变换为Date
                                    resp.datetime = new Date(Date.parse(resp.datetime as unknown as string))
                                    // 将筛选出的数据添加修改后的更改项的数据
                                    pageThis.listOfData = newData.concat(resp)
                                    pageThis.message.success("updated successfully")
                                }
                            })
                        },
                        error: function (err: HttpErrorResponse) {
                            pageThis.message.error(err.message)
                        }
                    })
                }
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    deleteTransactions() {
        let pageThis = this
        this.loading = true

        let req = this.transactionService.deleteTransactions(this.setOfCheckedItems).pipe(retry(3), catchError(this.handleError))
        if (this.setOfCheckedItems.size == 1) {
            req = this.transactionService.deleteTransaction(this.setOfCheckedItems).pipe(retry(3), catchError(this.handleError))
        }

        req.subscribe({
            next: function (resp) {
                if (resp.count !== 0) {
                    pageThis.listOfData = pageThis.listOfData.filter(item => !pageThis.setOfCheckedItems.has(item.id))
                    pageThis.setOfCheckedItems.clear()
                    pageThis.message.success("deleted successfully")
                }
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    getTransactions() {
        let pageThis = this
        this.loading = true

        const req = this.transactionService.getTransactions()
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                resp.forEach(function (transaction, index) {
                    resp[index].datetime = new Date(Date.parse(transaction.datetime as unknown as string))
                })
                pageThis.listOfData = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
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