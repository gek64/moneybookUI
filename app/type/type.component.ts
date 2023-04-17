import {Component, OnInit, ViewChild} from "@angular/core"
import {HttpErrorResponse} from "@angular/common/http"
import {Type} from "../../internal/interface/type"
import {catchError, retry, throwError} from "rxjs"
import {NzMessageService} from "ng-zorro-antd/message"
import {TypeService} from "../../internal/service/type.service"
import {TypeEditorComponent} from "./type-editor/type-editor.component"

@Component({
    selector: "app-type",
    templateUrl: "./type.component.html",
    styleUrls: ["./type.component.css"]
})
export class TypeComponent implements OnInit {
    @ViewChild("editor")
    editor: TypeEditorComponent

    showPagination: boolean = true
    showSizeChanger: boolean = true
    checkedAll: boolean = false
    indeterminate: boolean = false
    loading: boolean = false

    listOfData: readonly Type[] = []
    listOfCurrentPageData: readonly Type[] = []
    setOfCheckedItems: Set<string> = new Set<string>()

    constructor(private service: TypeService, private message: NzMessageService) {
    }

    // 初始化时获取类型数据
    ngOnInit() {
        this.getTypes()
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

    onItemChecked(id: string, checked: boolean) {
        this.updateCheckedSet(id, checked)
        this.refreshCheckedAllStatus()
    }

    onAllChecked(checked: boolean) {
        this.listOfCurrentPageData
            .forEach(({id}) => this.updateCheckedSet(id, checked))
        this.refreshCheckedAllStatus()
    }

    editType() {
        let types = this.listOfData.filter(item => item.id == this.setOfCheckedItems.values().next().value)
        if (types.length === 1) {
            this.editor.showModal(types[0])
        }
    }

    createType() {
        this.editor.showModal()
    }

    getEditorResult(event: Type) {
        console.log(event)
    }

    // 网络请求

    getTypes() {
        let pageThis = this
        this.loading = true

        const req = this.service.getAllType()
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

        const req = this.service.deleteManyType(this.setOfCheckedItems)
            .pipe(
                retry(3),
                catchError(this.handleError)
            )

        req.subscribe({
            next: function (resp: { count: number }) {
                if (resp.count !== 0) {
                    pageThis.listOfData = pageThis.listOfData.filter(item => !pageThis.setOfCheckedItems.has(item.id))
                    pageThis.setOfCheckedItems.clear()
                    pageThis.message.success("删除成功")
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
            err = `Network error occurred, Message: ${error.message}`
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            err = `Backend returned code ${error.status}, Message: ${error.message}`
        }

        // Return an observable with a user-facing error message.
        return throwError(() => new Error(err))
    }
}
