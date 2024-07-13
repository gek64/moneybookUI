import {Component, EventEmitter, Output} from "@angular/core"
import {PRODUCT} from "../../share/definition/product"

@Component({
    selector: "app-component-product-editor",
    templateUrl: "./product-editor.component.html",
    styleUrls: ["./product-editor.component.css"]
})
export class ProductEditorComponent {
    isVisible = false
    title = ""
    newProduct: PRODUCT = {id: "", name: "", code: "", specifications: "", remark: ""}

    @Output() editorResult = new EventEmitter()

    constructor() {
    }

    showModal(p?: PRODUCT): void {
        if (p != undefined) {
            this.title = "Edit"
            this.newProduct = Object.assign(this.newProduct, p)
        } else {
            this.title = "Create"
            this.newProduct.id = undefined
            this.newProduct.name = undefined
            this.newProduct.code = undefined
            this.newProduct.specifications = undefined
            this.newProduct.remark = undefined
        }
        this.isVisible = true
    }

    handleOk(): void {
        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.newProduct)
        this.isVisible = false
    }

    handleCancel(): void {
        this.isVisible = false
    }
}
