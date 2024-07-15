import {Component, OnInit, ViewChild} from "@angular/core"
import {NzMessageService} from "ng-zorro-antd/message"
import {catchError, retry, throwError} from "rxjs"
import {HttpErrorResponse} from "@angular/common/http"
import {PRODUCT, ProductColumns} from "../../share/definition/product"
import {ProductService} from "../../service/product.service"
import {ProductEditorComponent} from "../product-editor/product-editor.component"

@Component({
    selector: "app-component-product",
    templateUrl: "./product.component.html",
    styleUrls: ["./product.component.css"]
})

export class ProductComponent implements OnInit {
    // 子组件观察器
    @ViewChild("editor")
    editor: ProductEditorComponent
    checkedAll = false
    indeterminate = false
    loading = false
    listOfData: readonly PRODUCT[] = []
    listOfCurrentPageData: readonly PRODUCT[] = []
    setOfCheckedItems = new Set<string>()
    tableHeaderColumns = ProductColumns

    constructor(private productService: ProductService, private message: NzMessageService) {
    }

    // 生命周期
    ngOnInit() {
        this.readProducts()
    }

    // 数据库
    createProduct(p: PRODUCT) {
        this.loading = true

        this.productService.createProduct(p)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    if (resp.id !== undefined) {
                        this.readProducts()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    updateProduct(p: PRODUCT) {
        this.loading = true

        this.productService.updateProduct(p)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    if (resp.id !== undefined) {
                        this.readProducts()
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    deleteProducts() {
        this.loading = true

        this.productService.deleteProducts(this.setOfCheckedItems)
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: (resp) => {
                    if (resp.count !== 0) {
                        this.listOfData = this.listOfData.filter(item => !this.setOfCheckedItems.has(item.id))
                        this.setOfCheckedItems.clear()
                        this.message.success("deleted successfully")
                    }
                },
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    readProducts() {
        this.loading = true

        this.productService.readProducts()
            .pipe(retry(3), catchError(this.handleError))
            .subscribe({
                next: ps => this.listOfData = ps,
                error: (err: HttpErrorResponse) => this.message.error(err.message)
            })
            .add(() => this.loading = false)
    }

    // 中间功能
    refreshCheckedAllStatus() {
        this.checkedAll = this.listOfCurrentPageData.every(item => this.setOfCheckedItems.has(item.id))
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedItems.has(item.id)) && !this.checkedAll
    }

    onCurrentPageDataChange(listOfCurrentPageData: readonly PRODUCT[]) {
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

    getEditorResult(e: PRODUCT) {
        if (e.id !== undefined) {
            this.updateProduct(e)
        } else {
            this.createProduct(e)
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
        let ps = this.listOfData.filter(item => this.setOfCheckedItems.has(item.id))
        if (ps.length === 1) {
            this.editor.showModal(ps[0])
        }
    }

    createTypeButton() {
        this.editor.showModal(undefined)
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