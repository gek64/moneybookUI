import {Component, OnInit, ViewChild} from "@angular/core"
import {InvoiceService} from "../../../internal/service/invoice.service"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {InvoiceEditorComponent} from "./invoice-editor/invoice-editor.component"
import {Invoice} from "../../../internal/interface/invoice"
import {InvoiceColumns} from "../../../internal/definition/invoice"


@Component({
    selector: "app-table-invoice",
    templateUrl: "./invoice.component.html",
    styleUrls: ["./invoice.component.css"]
})

export class InvoiceComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: InvoiceEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly Invoice[] = []
    listOfCurrentPageData: readonly Invoice[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = InvoiceColumns

    constructor(private invoiceService: InvoiceService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
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

    getEditorResult(event: Invoice) {
        let newInvoice: Invoice = {
            account: undefined,
            accountId: "",
            amount: 0,
            datetime: undefined,
            id: "",
            status: "",
            title: "",
            type: undefined,
            typeId: ""
        }
        Object.assign(newInvoice, event)

        if (newInvoice.id !== undefined) {
            this.updateInvoice(event)
        } else {
            this.createInvoice(event)
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
        this.listOfData.forEach(invoice => this.setOfCheckedItems.add(invoice.id))
        this.refreshCheckedAllStatus()
    }

    editTypeButton() {
        let invoices = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (invoices.length === 1) {
            this.editor.showModal(invoices[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
    }

    createInvoice(newInvoice: Invoice) {
        let pageThis = this
        this.loading = true

        const req = this.invoiceService.createInvoice(newInvoice)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    // 查询一遍新更改的值是否在数据库中存在
                    const req = pageThis.invoiceService.getInvoiceById(resp.id)
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

    updateInvoice(updateInvoice: Invoice) {
        let pageThis = this
        this.loading = true

        const req = this.invoiceService.updateInvoice(updateInvoice)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    const req = pageThis.invoiceService.getInvoiceById(resp.id)
                        .pipe(
                            retry(3),
                            catchError(pageThis.handleError)
                        )
                    req.subscribe({
                        next: function (resp) {
                            pageThis.listOfData.forEach(function (invoice) {
                                if (invoice.id == resp.id) {
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

    deleteInvoices() {
        let pageThis = this
        this.loading = true

        const req = this.invoiceService.deleteManyInvoices(this.setOfCheckedItems)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

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