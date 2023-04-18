import {Component, OnInit, ViewChild} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {AccountEditorComponent} from "./account-editor/account-editor.component"
import {Account, AccountColumnItem} from "../../../internal/interface/account"
import {AccountService} from "../../../internal/service/account.service"

@Component({
    selector: "app-table-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.css"]
})

export class AccountComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: AccountEditorComponent

    showPagination: boolean = true
    showSizeChanger: boolean = true
    checkedAll: boolean = false
    indeterminate: boolean = false
    loading: boolean = false

    listOfData: readonly Account[] = []
    listOfCurrentPageData: readonly Account[] = []
    setOfCheckedItems: Set<string> = new Set<string>()

    // 表头
    columns: AccountColumnItem[] = [
        {
            name: "Id",
            sortOrder: null,
            sortFn: (a: Account, b: Account) => a.id.localeCompare(b.id),
            sortDirections: ["ascend", "descend", null]
        },
        {
            name: "Name",
            sortOrder: null,
            sortFn: (a: Account, b: Account) => a.name.localeCompare(b.name),
            sortDirections: ["ascend", "descend", null]
        },
        {
            name: "Number",
            sortOrder: null,
            sortFn: (a: Account, b: Account) => {
                let string1: string, string2: string
                if (a.number == null) {
                    string1 = ""
                } else {
                    string1 = a.number
                }
                if (b.number == null) {
                    string2 = ""
                } else {
                    string2 = b.number
                }
                return string1.localeCompare(string2)
            },
            sortDirections: ["ascend", "descend", null]
        },
        {
            name: "Type",
            sortOrder: null,
            sortFn: (a: Account, b: Account) => a.type.localeCompare(b.type),
            sortDirections: ["ascend", "descend", null]
        },
        {
            name: "Funds",
            sortOrder: null,
            sortFn: (a: Account, b: Account) => {
                let number1: number, number2: number
                if (a.funds == null) {
                    number1 = -1
                } else {
                    number1 = a.funds
                }
                if (b.funds == null) {
                    number2 = -1
                } else {
                    number2 = b.funds
                }
                return number1 - number2
            },
            sortDirections: ["ascend", "descend", null]
        }
    ]


    constructor(private accountService: AccountService, private message: NzMessageService) {
    }

    // 初始化时获取类型数据
    ngOnInit() {
        this.getAccounts()
    }

    // 清除所有已选择的项目
    clearSetOfCheckedItems() {
        this.setOfCheckedItems.clear()
        this.checkedAll = false
        this.refreshCheckedAllStatus()
    }

    // 刷新全选框的状态
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    // 当前表单页发生变化时触发
    onCurrentPageDataChange(listOfCurrentPageData: readonly Account[]) {
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

    onItemChecked(id: string, checked: boolean) {
        this.updateCheckedSet(id, checked)
        this.refreshCheckedAllStatus()
    }

    onAllChecked(checked: boolean) {
        this.listOfCurrentPageData
            .forEach(({id}) => this.updateCheckedSet(id, checked))
        this.refreshCheckedAllStatus()
    }

    editTypeButton() {
        let accounts = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (accounts.length === 1) {
            this.editor.showModal(accounts[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
    }

    getEditorResult(event: Account) {
        let newAccount: Account = {funds: 0, number: "", type: "", id: undefined, name: ""}
        Object.assign(newAccount, event)

        if (newAccount.id !== undefined) {
            this.updateAccount(event)
        } else {
            this.createAccount(event)
        }
    }

    // 网络请求
    createAccount(newAccount: Account) {
        let pageThis = this
        this.loading = true

        const req = this.accountService.createAccount(newAccount)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    pageThis.listOfData = pageThis.listOfData.concat(resp)
                    pageThis.message.success("created successfully")
                }
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    updateAccount(updateAccount: Account) {
        let pageThis = this
        this.loading = true

        const req = this.accountService.updateAccount(updateAccount)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                if (resp.id !== undefined) {
                    pageThis.listOfData.forEach(function (value, index, array) {
                        if (value.id == resp.id) {
                            // 先筛选出不含更改项的所有数据
                            let newData = pageThis.listOfData.filter(item => item.id != resp.id)
                            // 将筛选出的数据添加修改后的更改项的数据
                            pageThis.listOfData = newData.concat(resp)
                        }
                    })
                    pageThis.message.success("updated successfully")
                }
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    getAccounts() {
        let pageThis = this
        this.loading = true

        const req = this.accountService.getAllAccounts()
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp) {
                pageThis.listOfData = resp
            },
            error: function (err: HttpErrorResponse) {
                pageThis.message.error(err.message)
            }
        }).add(function () {
            pageThis.loading = false
        })
    }

    deleteAccounts() {
        let pageThis = this
        this.loading = true

        const req = this.accountService.deleteManyAccounts(this.setOfCheckedItems)
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