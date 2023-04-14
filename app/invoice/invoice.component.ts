import {Component} from "@angular/core"

@Component({
    selector: "app-invoice",
    templateUrl: "./invoice.component.html",
    styleUrls: ["./invoice.component.css"]
})
export class InvoiceComponent {
    loading = false

    data = [
        {
            title: "Ant Design Title 1"
        },
        {
            title: "Ant Design Title 2"
        },
        {
            title: "Ant Design Title 3"
        },
        {
            title: "Ant Design Title 4"
        }
    ]

    change(): void {
        this.loading = !this.loading
    }
}
