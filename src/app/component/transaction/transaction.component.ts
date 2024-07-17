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
    TransactionTableHeaders
} from "../../share/definition/transaction"


@Component({
    selector: "app-component-transaction",
    templateUrl: "./transaction.component.html",
    styleUrls: ["./transaction.component.css"]
})

export class TransactionComponent implements OnInit {
    // 编辑器子组件观察器
    @ViewChild("editor")
    editor: TransactionEditorComponent

    // 表头变量
    tableHeaders = TransactionTableHeaders

    // 表头全选框变量
    // 是否全选
    selectAll = false
    // 是否部分选择
    selectSome = false
    // 被选中的所有的id
    selectedIds = new Set<string>()

    // 表内容变量
    // 表中所有数据
    data: TRANSACTION_OUTPUT[] = []
    // 当前页面中表的数据(随着页码,页面大小变化)
    dataCurrentPage: TRANSACTION_OUTPUT[] = []
    // 是否显示加载状态
    isLoading = false

    // 构筑函数,用于注册服务
    constructor(private transactionService: TransactionService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.readTransactions()
    }

    // 表格中当前页的数据发生改变时刷新变量状态
    onCurrentPageDataChange($event: readonly TRANSACTION[]) {
        this.dataCurrentPage = [].concat($event)
        this.refreshCheckBoxStatus()
    }

    // 表头全选框
    checkAllBox($event: boolean) {
        if ($event) {
            this.dataCurrentPage.forEach(t => this.selectedIds.add(t.id))
        } else {
            this.dataCurrentPage.forEach(t => this.selectedIds.delete(t.id))
        }
        this.refreshCheckBoxStatus()
    }

    // 表中数据选框
    checkItemBox($event: boolean, item: TRANSACTION_INPUT) {
        if ($event) {
            this.selectedIds.add(item.id)
        } else {
            this.selectedIds.delete(item.id)
        }
        this.refreshCheckBoxStatus()
    }

    // 刷新选择框的状态
    refreshCheckBoxStatus() {
        this.selectAll = this.dataCurrentPage.every(item => this.selectedIds.has(item.id))
        this.selectSome = this.dataCurrentPage.some(item => this.selectedIds.has(item.id)) && !this.selectAll
    }

    // 全选按钮
    selectAllButton() {
        this.data.forEach(t => this.selectedIds.add(t.id))
        this.refreshCheckBoxStatus()
    }

    // 清除按钮
    clearButton() {
        this.selectedIds.clear()
        this.refreshCheckBoxStatus()
    }

    // 删除按钮
    deleteButton() {
        this.deleteTransactions()
    }

    // 修改按钮
    modifyButton() {
        let ts = this.data.filter(item => this.selectedIds.has(item.id))
        if (ts.length == 1) {
            this.editor.showModal(ts[0])
        }
    }

    // 创建按钮
    createButton() {
        this.editor.showModal()
    }

    // 表对应的数据库操作
    createTransaction(t: TRANSACTION_INPUT) {
        this.isLoading = true

        this.transactionService.createTransaction(t)
            .pipe(retry(3), catchError($error => throwError(() => new Error($error.error()))))
            .subscribe({
                next: (resp: TRANSACTION) => {
                    if (resp.id !== undefined) {
                        this.readTransactions()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.isLoading = false)
    }

    updateTransaction(t: TRANSACTION_INPUT) {
        this.isLoading = true

        this.transactionService.updateTransaction(t)
            .pipe(retry(3), catchError($error => throwError(() => new Error($error.error()))))
            .subscribe({
                next: (resp: TRANSACTION) => {
                    if (resp.id !== undefined) {
                        this.readTransactions()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.isLoading = false)
    }

    deleteTransactions() {
        this.isLoading = true

        this.transactionService.deleteTransactions([...this.selectedIds])
            .pipe(retry(3), catchError($error => throwError(() => new Error($error.error()))))
            .subscribe({
                next: resp => {
                    if (resp.count > 0) {
                        this.data = this.data.filter(item => !this.selectedIds.has(item.id))
                        this.selectedIds.clear()
                        this.message.success("deleted successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.isLoading = false)
    }

    readTransactions() {
        this.isLoading = true

        this.transactionService.readTransactions()
            .pipe(retry(3), catchError($error => throwError(() => new Error($error.error()))))
            .subscribe({
                next: (ts) => {
                    // 获取到的日期为字符串,需要处理每一条交易数据中的日期
                    ts.forEach((t, i) => {
                        ts[i].datetime = new Date(Date.parse(t.datetime as unknown as string))
                    })
                    this.data = ts
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.isLoading = false)
    }

    getEditorResult(e: TRANSACTION_INPUT) {
        if (e.id !== undefined) {
            this.updateTransaction(e)
        } else {
            this.createTransaction(e)
        }
    }
}