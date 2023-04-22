import {Component, OnInit, ViewChild} from "@angular/core"
import {HttpErrorResponse} from "@angular/common/http"
import {Type} from "../../../../internal/interface/type"
import {catchError, retry, throwError} from "rxjs"
import {NzMessageService} from "ng-zorro-antd/message"
import {TypeService} from "../../../../internal/service/type.service"
import {TypeEditorComponent} from "./type-editor/type-editor.component"
import {TypeColumns} from "../../../../internal/definition/type"

@Component({
    selector: "app-table-type",
    templateUrl: "./type.component.html",
    styleUrls: ["./type.component.css"]
})
export class TypeComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: TypeEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly Type[] = []
    listOfCurrentPageData: readonly Type[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = TypeColumns

    constructor(private typeService: TypeService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.getTypes()
    }

    // 中间功能
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly Type[]) {
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

    getEditorResult(event: Type) {
        let newType: Type = {id: undefined, name: ""}
        Object.assign(newType, event)

        if (newType.id !== undefined) {
            this.updateType(event)
        } else {
            this.createType(event)
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
        this.listOfData.forEach(invoice => this.setOfCheckedItems.add(invoice.id))
        this.refreshCheckedAllStatus()
    }

    editTypeButton() {
        let types = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (types.length === 1) {
            this.editor.showModal(types[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
    }

    // 网络请求
    createType(newType: Type) {
        let pageThis = this
        this.loading = true

        const req = this.typeService.createType(newType)
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

    updateType(updateType: Type) {
        let pageThis = this
        this.loading = true

        const req = this.typeService.updateType(updateType)
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

    getTypes() {
        let pageThis = this
        this.loading = true

        const req = this.typeService.getAllTypes()
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

    deleteTypes() {
        let pageThis = this
        this.loading = true

        const req = this.typeService.deleteManyTypes(this.setOfCheckedItems)
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