import {Component, OnInit} from "@angular/core"
import {Invoice} from "../../../../internal/interface/invoice"
import {InvoiceService} from "../../../../internal/service/invoice.service"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {InvoiceColumns, InvoiceStatus} from "../../../../internal/definition/invoice"
import {AccountService} from "../../../../internal/service/account.service"
import {TypeService} from "../../../../internal/service/type.service"
import {Type} from "../../../../internal/interface/type"
import {Account} from "../../../../internal/interface/account"
import {EndOfDay, EndOfMonth, EndOfYear, StartOfDay, StartOfMonth, StartOfYear} from "../../../../internal/date/range"

@Component({
    selector: "app-invoice-report",
    templateUrl: "./invoice-report.component.html",
    styleUrls: ["./invoice-report.component.css"]
})
export class InvoiceReportComponent implements OnInit {
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly Invoice[] = []
    listOfCurrentPageData: readonly Invoice[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = InvoiceColumns
    allInvoices: readonly Invoice[] = []
    allTypes: readonly  Type[] = []
    allAccounts: readonly  Account[] = []
    allStatus: { key: string, value: string }[] = InvoiceStatus
    selectedTypes: Type[] = []
    selectedAccounts: Account[] = []
    selectedStatus: { key: string, value: string }[] = []
    selectedDatetime: Date[] = []
    selectedAmount: number = 0

    DefinedDateRanges = {
        "Today": [StartOfDay(new Date()), EndOfDay(new Date())],
        "This Month": [StartOfMonth(new Date()), EndOfMonth(new Date())],
        "This Year": [StartOfYear(new Date()), EndOfYear(new Date())]
    }


    constructor(private invoiceService: InvoiceService, private accountService: AccountService, private typeService: TypeService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.getTypes()
        this.getAccounts()
        this.getInvoices()
    }

    // 中间功能
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly Invoice[]) {
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
    go() {
        let pageThis = this
        this.listOfData = this.allInvoices.filter(function (invoice) {
            let isType: boolean, isAccount: boolean, isStatus: boolean, isDatetime = false

            if (pageThis.selectedTypes.length == 0) {
                isType = true
            } else {
                isType = pageThis.selectedTypes.some((type) => type.id == invoice.typeId)
            }

            if (pageThis.selectedAccounts.length == 0) {
                isAccount = true
            } else {
                isAccount = pageThis.selectedAccounts.some((account) => account.id == invoice.accountId)
            }

            if (pageThis.selectedStatus.length == 0) {
                isStatus = true
            } else {
                isStatus = pageThis.selectedStatus.some((status) => status.value == invoice.status)
            }

            if (pageThis.selectedDatetime.length < 2) {
                isDatetime = true
            } else {
                // 将日期选择器的时间毫秒位设置为0
                let time1 = new Date(pageThis.selectedDatetime[0].setMilliseconds(0))
                let time2 = new Date(pageThis.selectedDatetime[1].setMilliseconds(0))
                isDatetime = time1 <= invoice.datetime && invoice.datetime <= time2
            }

            return isType && isAccount && isStatus && isDatetime
        })

        pageThis.selectedAmount = 0
        this.listOfData.forEach(function (invoice) {
            pageThis.selectedAmount += invoice.amount
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
        this.listOfData.forEach(invoice => this.setOfCheckedItems.add(invoice.id))
        this.refreshCheckedAllStatus()
    }

    isTypeNotSelected(value: Type): boolean {
        return this.selectedTypes.indexOf(value) === -1
    }

    isAccountNotSelected(value: Account): boolean {
        return this.selectedAccounts.indexOf(value) === -1
    }

    isStatusNotSelected(value: { key: string, value: string }): boolean {
        return this.selectedStatus.indexOf(value) === -1
    }

    updateStatus(status: string) {
        let pageThis = this
        this.loading = true

        const req = this.invoiceService.patchManyInvoicesStatus(Array.from(this.setOfCheckedItems), status)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.count != undefined && resp.count != 0) {
                    pageThis.listOfData.forEach(function (invoice, index, array) {
                        pageThis.setOfCheckedItems.forEach(function (selectedId) {
                            if (invoice.id == selectedId) {
                                array[index].status = status
                            }
                        })
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

    getInvoices() {
        let pageThis = this
        this.loading = true

        const req = this.invoiceService.getAllInvoices()
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                resp.forEach(function (value, index, array) {
                    resp[index].datetime = new Date(Date.parse(value.datetime as unknown as string))
                })
                pageThis.allInvoices = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
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
                pageThis.allTypes = resp
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
                pageThis.allAccounts = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
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