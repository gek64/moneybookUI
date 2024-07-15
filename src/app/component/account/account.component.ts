import {Component, OnInit, ViewChild} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {AccountEditorComponent} from "../account-editor/account-editor.component"
import {AccountService} from "../../service/account.service"
import {ACCOUNT, AccountColumns} from "../../share/definition/account"

@Component({
    selector: "app-component-account",
    templateUrl: "./account.component.html",
    styleUrls: ["./account.component.css"]
})

export class AccountComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: AccountEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly ACCOUNT[] = []
    listOfCurrentPageData: readonly ACCOUNT[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = AccountColumns

    constructor(private accountService: AccountService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.getAccounts()
    }

    // 中间功能
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly ACCOUNT[]) {
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

    getEditorResult(event: ACCOUNT) {
        let newAccount: ACCOUNT = {funds: 0, number: "", type: "", id: undefined, name: ""}
        Object.assign(newAccount, event)

        if (newAccount.id !== undefined) {
            this.updateAccount(event)
        } else {
            this.createAccount(event)
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

    clearSetOfCheckedItems() {
        this.setOfCheckedItems.clear()
        this.checkedAll = false
        this.refreshCheckedAllStatus()
    }

    selectAllItemsButton() {
        this.listOfData.forEach(a => this.setOfCheckedItems.add(a.id))
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

    // 网络请求
    createAccount(newAccount: ACCOUNT) {
        let pageThis = this
        this.loading = true

        this.accountService.createAccount(newAccount)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: function (resp) {
                    if (resp.id !== undefined) {
                        pageThis.listOfData = pageThis.listOfData.concat(resp)
                        pageThis.message.success("created successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    updateAccount(updateAccount: ACCOUNT) {
        let pageThis = this
        this.loading = true

        this.accountService.updateAccount(updateAccount)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: function (resp) {
                    if (resp.id !== undefined) {
                        pageThis.listOfData.forEach(function (account) {
                            if (account.id == resp.id) {
                                // 先筛选出不含更改项的所有数据
                                let newData = pageThis.listOfData.filter(item => item.id != resp.id)
                                // 将筛选出的数据添加修改后的更改项的数据
                                pageThis.listOfData = newData.concat(resp)
                            }
                        })
                        pageThis.message.success("updated successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    getAccounts() {
        let pageThis = this
        this.loading = true

        this.accountService.getAccounts()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: function (resp) {
                    pageThis.listOfData = resp
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    deleteAccounts() {
        let pageThis = this
        this.loading = true

        this.accountService.deleteAccounts(this.setOfCheckedItems)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: function (resp) {
                    if (resp.count !== 0) {
                        pageThis.listOfData = pageThis.listOfData.filter(item => !pageThis.setOfCheckedItems.has(item.id))
                        pageThis.setOfCheckedItems.clear()
                        pageThis.message.success("deleted successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
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