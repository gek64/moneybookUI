import {Component} from "@angular/core"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    isCollapsed: boolean = false

    collapseSideBar(event: { view: { innerWidth: number } }) {
        if (event.view.innerWidth <= 900) {
            this.isCollapsed = true
        }
    }
}
