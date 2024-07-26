import {Component, EventEmitter, Output} from "@angular/core"

import {ACCOUNT} from "../../share/definition/account"

@Component({
    selector: "app-component-account-editor",
    templateUrl: "./account-editor.component.html",
    styleUrls: ["./account-editor.component.css"]
})
export class AccountEditorComponent {
    // 对话框中数据
    data: ACCOUNT = {id: "", name: "", number: "", type: "", funds: 0}

    isVisible = false
    title = ""


    @Output() editorResult = new EventEmitter()

    show(newAccount?: ACCOUNT) {
        if (newAccount != undefined) {
            this.title = "Edit"
            this.data = Object.assign(this.data, newAccount)
        } else {
            this.title = "Create"
            this.data.id = undefined
            this.data.name = undefined
            this.data.number = undefined
            this.data.type = undefined
            this.data.funds = undefined
        }
        this.isVisible = true
    }

    ok() {
        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.data)
        this.isVisible = false
    }

    cancel() {
        this.isVisible = false
    }
}
