import {Component, EventEmitter, Output} from "@angular/core"
import {PRODUCT} from "../../share/definition/product"

@Component({
    selector: "app-component-product-editor",
    templateUrl: "./product-editor.component.html",
    styleUrls: ["./product-editor.component.css"]
})
export class ProductEditorComponent {
    // 对话框变量
    // 对话框标题
    title = ""
    // 对话框数据
    data: PRODUCT = {id: undefined, name: undefined, specifications: undefined, remark: undefined}
    // 是否显示对话框
    isVisible = false

    // 外部组件调用来读取数据
    @Output() readEditorData = new EventEmitter<PRODUCT>()

    // 显示对话框, 外部观察器调用来弹出对话框
    show(newData?: PRODUCT) {
        if (newData !== undefined) {
            this.title = "修改"
            this.data = newData
        } else {
            this.title = "新建"
        }
        this.isVisible = true
    }

    // 检验数据是否符合, 不符合确认按钮被禁用
    isDataOK() {
        return this.data.name === undefined || this.data.name === ""
    }

    // 确认按钮, 将编辑器的结果传递给外部组件
    okButton() {
        this.readEditorData.emit(this.data)
        this.isVisible = false
    }

    // 取消按钮
    cancelButton() {
        this.isVisible = false
    }
}
