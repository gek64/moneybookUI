import {Component, OnInit, ViewChild} from "@angular/core"
import {TransactionService} from "../../service/transaction.service"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {TransactionEditorComponent} from "../transaction-editor/transaction-editor.component"
import {
    TRANSACTION,
    TRANSACTION_INPUT,
    TRANSACTION_OUTPUT,
    TransactionColumns
} from "../../share/definition/transaction"


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
    listOfData: readonly TRANSACTION_OUTPUT[] = []
    listOfCurrentPageData: readonly TRANSACTION_OUTPUT[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = TransactionColumns

    constructor(private transactionService: TransactionService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.readTransactions()
    }

    // 数据库操作
    createTransaction(t: TRANSACTION_INPUT) {
        this.loading = true

        this.transactionService.createTransaction(t)
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
                        this.message.success("deleted successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    readTransactions() {
        this.loading = true

        this.transactionService.readTransactions()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (ts) => {
                    // 获取到的日期为字符串,需要处理每一条交易数据中的日期
                    ts.forEach((t, i) => {
                        ts[i].datetime = new Date(Date.parse(t.datetime as unknown as string))
                    })
                    this.listOfData = ts
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
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

    getEditorResult(e: TRANSACTION_INPUT) {
        if (e.id !== undefined) {
            this.updateTransaction(e)
        } else {
            this.createTransaction(e)
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
        let ts = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (ts.length === 1) {
            this.editor.showModal(ts[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
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