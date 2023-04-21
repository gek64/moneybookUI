import {NgModule} from "@angular/core"
import {BrowserModule} from "@angular/platform-browser"
import {AppComponent} from "./app.component"
import {AppRoutingModule} from "./app-routing.module"
import {HttpClientModule} from "@angular/common/http"
import {NoopAnimationsModule} from "@angular/platform-browser/animations"
import {NzLayoutModule} from "ng-zorro-antd/layout"
import {NzMenuModule} from "ng-zorro-antd/menu"
import {NzIconModule} from "ng-zorro-antd/icon"
import {InvoiceComponent} from "./tables/invoice/invoice.component"
import {TypeComponent} from "./tables/type/type.component"
import {AccountComponent} from "./tables/account/account.component"
import {HomeComponent} from "./home/home.component"
import {NgOptimizedImage, registerLocaleData} from "@angular/common"
import {NzButtonModule} from "ng-zorro-antd/button"
import {NzMessageModule} from "ng-zorro-antd/message"
import {TypeService} from "../internal/service/type.service"
import {NzTableModule} from "ng-zorro-antd/table"
import {NzBadgeModule} from "ng-zorro-antd/badge"
import {TypeEditorComponent} from "./tables/type/type-editor/type-editor.component"
import {NzModalModule} from "ng-zorro-antd/modal"
import {NzInputModule} from "ng-zorro-antd/input"
import {FormsModule} from "@angular/forms"
import {InvoiceEditorComponent} from "./tables/invoice/invoice-editor/invoice-editor.component"
import {AccountEditorComponent} from "./tables/account/account-editor/account-editor.component"
import {AccountService} from "../internal/service/account.service"
import {NzInputNumberModule} from "ng-zorro-antd/input-number"
import {InvoiceService} from "../internal/service/invoice.service"
import {NzDatePickerModule} from "ng-zorro-antd/date-picker"
import {NzSelectModule} from "ng-zorro-antd/select"
import {InvoiceReportComponent} from "./reports/invoice-report/invoice-report.component"
import {NzStatisticModule} from "ng-zorro-antd/statistic"
import zh from "@angular/common/locales/zh"
import {IconDefinition} from "@ant-design/icons-angular"
import {FileDoneOutline, TableOutline} from "@ant-design/icons-angular/icons"


registerLocaleData(zh)
const icons: IconDefinition[] = [TableOutline, FileDoneOutline]

@NgModule({
    declarations: [
        AppComponent,
        InvoiceComponent,
        TypeComponent,
        AccountComponent,
        HomeComponent,
        TypeEditorComponent,
        InvoiceEditorComponent,
        AccountEditorComponent,
        InvoiceReportComponent,
    ],
    imports: [
        AppRoutingModule,
        NzIconModule.forRoot(icons),
        BrowserModule,
        HttpClientModule,
        NoopAnimationsModule,
        NgOptimizedImage,
        NzLayoutModule,
        NzMenuModule,
        NzIconModule,
        NzButtonModule,
        NzMessageModule,
        NzTableModule,
        NzBadgeModule,
        NzModalModule,
        NzInputModule,
        FormsModule,
        NzInputNumberModule,
        NzDatePickerModule,
        NzSelectModule,
        NzStatisticModule
    ],
    providers: [
        TypeService,
        AccountService,
        InvoiceService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
