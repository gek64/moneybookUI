import {NgModule} from "@angular/core"
import {BrowserModule} from "@angular/platform-browser"
import {AppComponent} from "./app.component"
import {AppRoutingModule} from "./app-routing.module"
import {HttpClientModule} from "@angular/common/http"
import {NoopAnimationsModule} from "@angular/platform-browser/animations"
import {NzLayoutModule} from "ng-zorro-antd/layout"
import {NzMenuModule} from "ng-zorro-antd/menu"
import {NzIconModule} from "ng-zorro-antd/icon"
import {InvoiceComponent} from "./invoice/invoice.component"
import {TypeComponent} from "./type/type.component"
import {AccountComponent} from "./account/account.component"
import {HomeComponent} from "./home/home.component"
import {NzListModule} from "ng-zorro-antd/list"
import {NgOptimizedImage} from "@angular/common"
import {NzButtonModule} from "ng-zorro-antd/button"
import {NzCheckboxModule} from "ng-zorro-antd/checkbox"
import {NzMessageModule} from "ng-zorro-antd/message"
import {TypeService} from "../internal/service/type.service"

@NgModule({
    declarations: [
        AppComponent,
        InvoiceComponent,
        TypeComponent,
        AccountComponent,
        HomeComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        NoopAnimationsModule,
        NgOptimizedImage,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzListModule,
        NzButtonModule,
        NzCheckboxModule,
        NzMessageModule
    ],
    providers: [
        TypeService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
