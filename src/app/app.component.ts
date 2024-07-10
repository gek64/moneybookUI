import {Component, isDevMode, OnInit} from "@angular/core"
import {environment} from "../environments/environment"
import {environmentDev} from "../environments/environment.dev"
import {environmentProd} from "../environments/environment.prod"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    ngOnInit() {
        if (isDevMode()) {
            environment.server = environmentDev.server
        } else {
            environment.server = environmentProd.server
        }
    }

    isCollapsed: boolean = false

    collapseSideBar(event: { view: { innerWidth: number } }) {
        if (event.view.innerWidth <= 900) {
            this.isCollapsed = true
        }
    }
}
