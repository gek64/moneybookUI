import {Component, EventEmitter, Output} from "@angular/core"
import {Type} from "../../../internal/interface/type"
import {TypeService} from "../../../internal/service/type.service"

@Component({
    selector: "app-type-editor",
    templateUrl: "./type-editor.component.html",
    styleUrls: ["./type-editor.component.css"]
})
export class TypeEditorComponent {
    isVisible = false
    title = ""
    okText = "提交"
    newType = new class implements Type {
        id: string | undefined
        name: string
    }

    @Output() editorResult = new EventEmitter()

    constructor(private service: TypeService) {
    }

    showModal(newType?: Type): void {
        if (newType != undefined) {
            this.title = "修改"
            this.newType = newType
        } else {
            this.title = "新建"
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
