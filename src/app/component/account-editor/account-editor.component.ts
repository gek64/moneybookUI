import {Component, EventEmitter, Output} from "@angular/core"
import {ACCOUNT} from "../../share/definition/account"

@Component({
    selector: "app-component-account-editor",
    templateUrl: "./account-editor.component.html",
    styleUrls: ["./account-editor.component.css"]
})
export class AccountEditorComponent {
    // 对话框变量
    // 对话框标题
    title = ""
    // 对话框数据
    data: ACCOUNT = {id: undefined, name: undefined, number: undefined, type: undefined, funds: undefined}
    // 是否显示对话框
    isVisible = false

    // 外部组件调用来读取数据
    @Output() readEditorData = new EventEmitter<ACCOUNT>()

    // 显示对话框, 外部观察器调用来弹出对话框
    show(newData?: ACCOUNT) {
        if (newData !== undefined) {
            this.title = "修改"
            this.data = newData
        } else {
            this.title = "新建"
            this.data = {id: undefined, name: undefined, number: undefined, type: undefined, funds: undefined}
        }
        this.isVisible = true
    }

    // 检验数据是否符合, 不符合确认按钮被禁用
    isDataOK() {
        return this.data.name === undefined || this.data.name === "" || this.data.type === undefined || this.data.type === ""
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
