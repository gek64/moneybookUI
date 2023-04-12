import {NgModule} from "@angular/core"
import {BrowserModule} from "@angular/platform-browser"
import {AppRoutingModule} from "./app-routing.module"
import {AppComponent} from "./app.component"
import {NgOptimizedImage} from "@angular/common"
import {NzIconModule} from "ng-zorro-antd/icon"
import {NzButtonModule} from "ng-zorro-antd/button"

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        // angular 组件
        BrowserModule,
        AppRoutingModule,
        NgOptimizedImage,
        // ant 组件
        NzIconModule,
        NzButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
