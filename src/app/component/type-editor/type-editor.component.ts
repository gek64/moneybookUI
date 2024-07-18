import {Component, EventEmitter, Output} from "@angular/core"
import {TYPE} from "../../share/definition/type"

@Component({
    selector: "app-component-type-editor",
    templateUrl: "./type-editor.component.html",
    styleUrls: ["./type-editor.component.css"]
})
export class TypeEditorComponent {
    isVisible = false
    title = ""
    newType = new class implements TYPE {
        id: string | undefined
        name: string
    }

    @Output() editorResult = new EventEmitter()

    constructor() {
    }

    showModal(newType?: TYPE): void {
        if (newType != undefined) {
            this.title = "Edit"

            // 使用 this.newType = newType是引用赋值
            // 值赋值
            // this.newType.id = newType.id
            // this.newType.name = newType.name
            Object.assign(this.newType, newType)
        } else {
            this.title = "Create"
            this.newType.id = undefined
            this.newType.name = ""
        }
        this.isVisible = true
    }

    handleOk(): void {
        // 将编辑器的结果传递给父组件
        this.editorResult.emit(this.newType)
        this.isVisible = false
    }

    handleCancel(): void {
        this.isVisible = false
    }
}