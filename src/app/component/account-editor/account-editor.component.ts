import {Component, EventEmitter, Output} from "@angular/core"

import {ACCOUNT} from "../../share/definition/account"

@Component({
    selector: "app-component-account-editor",
    templateUrl: "./account-editor.component.html",
    styleUrls: ["./account-editor.component.css"]
})
export class AccountEditorComponent {
    isVisible = false
    title = ""
    newAccount = new class implements ACCOUNT {
        id: string
        name: string
        number?: string
        type: string
        funds?: number
    }

    @Output() editorResult = new EventEmitter()

    constructor() {
    }

    showModal(newAccount?: ACCOUNT): void {
        if (newAccount != undefined) {
            this.title = "Edit"
            this.newAccount = Object.assign(this.newAccount, newAccount)
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
