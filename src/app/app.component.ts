import {Component, isDevMode, OnInit} from "@angular/core"
import {environmentDev} from "../environments/environment.dev"
import {environmentProd} from "../environments/environment.prod"
import {ENVIRONMENT} from "./share/definition/environment"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    // 初始化时判断运行环境变量
    ngOnInit() {
        if (isDevMode()) {
            environment = environmentDev
        } else {
            environment = environmentProd
        }
    }
}

// 导出环境变量供全局使用
export let environment: ENVIRONMENT = {
    production: false,
    server: ""
}