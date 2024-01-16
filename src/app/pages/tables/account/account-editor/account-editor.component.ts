import {Component, EventEmitter, Output} from "@angular/core"
import {Account} from "../../../../../internal/interface/account"

@Component({
    selector: "app-table-account-editor",
    templateUrl: "./account-editor.component.html",
    styleUrls: ["./account-editor.component.css"]
})
export class AccountEditorComponent {
    isVisible = false
    title = ""
    newAccount = new class implements Account {
        id: string
        name: string
        number?: string
        type: string
        funds?: number
    }

    @Output() editorResult = new EventEmitter()

    constructor() {
    }

    showModal(newAccount?: Account): void {
        if (newAccount != undefined) {
            this.title = "Edit"

            // 使用 this.newX = newX是引用赋值
            // 值赋值
            // this.newX.id = newX.id
            // this.newX.name = newX.name
            Object.assign(this.newAccount, newAccount)
        } else {
            this.title = "Create"
            this.newAccount.id = undefined
            this.newAccount.name = undefined
            this.newAccount.number = undefined
            this.newAccount.type = undefined
            this.newAccount.funds = undefined
        }
        this.isVisible = true
    }

    handleOk(): void {
        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.newAccount)
        this.isVisible = false
    }

    handleCancel(): void {
        this.isVisible = false
    }
}
