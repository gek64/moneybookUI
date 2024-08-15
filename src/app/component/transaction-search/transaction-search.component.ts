import {Component, OnInit, ViewChild} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {HttpErrorResponse} from "@angular/common/http"
import {TransactionStatus} from "../../share/definition/transactionStatus"
import {EndOfDay, EndOfMonth, EndOfYear, StartOfDay, StartOfMonth, StartOfYear} from "../../share/date/dataRange"
import {TRANSACTION_INPUT, TRANSACTION_OUTPUT, TransactionTableHeaders} from "../../share/definition/transaction"
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
    isLoading = false
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
        this.isLoading = true

        this.transactionService.patchTransactionsStatus(Array.from(this.setOfCheckedItems), status)
            .then(data => {
                if (data.count != undefined && data.count != 0) {
                    pageThis.listOfData.forEach(function (transaction, index, array) {
                        pageThis.setOfCheckedItems.forEach(function (selectedId) {
                            if (transaction.id == selectedId) {
                                array[index].status = status
                            }
                        })
                    })
                }
            })
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    updateTransaction(t: TRANSACTION_INPUT) {
        this.isLoading = true

        this.transactionService.updateTransaction(t)
            .then(data => {
                if (data.id !== undefined) {
                    this.readTransactions()
                }
            })
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    deleteTransactions() {
        this.isLoading = true

        this.transactionService.deleteTransactions(new Set([...this.setOfCheckedItems]))
            .then(data => {
                if (data.count > 0) {
                    this.listOfData = this.listOfData.filter(item => !this.setOfCheckedItems.has(item.id))
                    this.setOfCheckedItems.clear()
                }
            })
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    readTransactions() {
        this.isLoading = true

        this.transactionService.readTransactions()
            .then(data => {
                data.forEach(function (transaction, index) {
                    data[index].datetime = new Date(Date.parse(transaction.datetime as unknown as string))
                })
                this.allTransactions = data
            })
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    async readProducts() {
        await this.productService.readProducts()
            .then(ds => this.allProducts = [...ds])
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    async readTypes() {
        await this.typeService.readTypes()
            .then(ds => this.allTypes = [...ds])
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    async readAccounts() {
        await this.accountService.readAccounts()
            .then(ds => this.allAccounts = [...ds])
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
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
            .then(data => {
                this.listOfData = data

                // 统计金额
                this.listOfData.forEach((transaction, index) => {
                    this.listOfData[index].datetime = new Date(this.listOfData[index].datetime)
                    this.selectedAmount += transaction.amount
                })
            })
            .catch((e: HttpErrorResponse) => this.message.error(e.message))
            .finally(() => this.isLoading = false)
    }

    editTypeButton() {
        let ts = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (ts.length === 1) {
            this.editor.show(ts[0])
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
}