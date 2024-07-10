// angular 模块
import {NgModule} from "@angular/core"
import {NgOptimizedImage, registerLocaleData} from "@angular/common"
import {BrowserModule} from "@angular/platform-browser"
import {FormsModule} from "@angular/forms"
import {NoopAnimationsModule} from "@angular/platform-browser/animations"
import {provideHttpClient} from "@angular/common/http"
import zh from "@angular/common/locales/zh"

// ant design 模块
import {NzLayoutModule} from "ng-zorro-antd/layout"
import {NzMenuModule} from "ng-zorro-antd/menu"
import {NzIconModule} from "ng-zorro-antd/icon"
import {NzButtonModule} from "ng-zorro-antd/button"
import {NzMessageModule} from "ng-zorro-antd/message"
import {NzTableModule} from "ng-zorro-antd/table"
import {NzBadgeModule} from "ng-zorro-antd/badge"
import {NzModalModule} from "ng-zorro-antd/modal"
import {NzInputModule} from "ng-zorro-antd/input"
import {NzInputNumberModule} from "ng-zorro-antd/input-number"
import {NzDatePickerModule} from "ng-zorro-antd/date-picker"
import {NzSelectModule} from "ng-zorro-antd/select"
import {NzStatisticModule} from "ng-zorro-antd/statistic"
import {IconDefinition} from "@ant-design/icons-angular"
import {FileDoneOutline, HomeOutline, TableOutline} from "@ant-design/icons-angular/icons"

// 页面模块
import {AppComponent} from "./app.component"
import {AppRoutingModule} from "./app-routing.module"
import {StatusPipe} from "./pipe/status.pipe"
import {TransactionComponent} from "./component/tables/transaction/transaction.component"
import {TypeComponent} from "./component/tables/type/type.component"
import {AccountComponent} from "./component/tables/account/account.component"
import {HomeComponent} from "./component/home/home.component"
import {TypeEditorComponent} from "./component/tables/type/type-editor/type-editor.component"
import {TransactionReportComponent} from "./component/reports/transaction-report/transaction-report.component"
import {
    TransactionEditorComponent
} from "./component/tables/transaction/transaction-editor/transaction-editor.component"
import {AccountEditorComponent} from "./component/tables/account/account-editor/account-editor.component"

// http 服务
import {TypeService} from "./service/type.service"
import {AccountService} from "./service/account.service"
import {TransactionService} from "./service/transaction.service"

registerLocaleData(zh)
const icons: IconDefinition[] = [TableOutline, FileDoneOutline, HomeOutline]

@NgModule({
    declarations: [
        AppComponent,
        TransactionComponent,
        TypeComponent,
        AccountComponent,
        HomeComponent,
        TypeEditorComponent,
        TransactionEditorComponent,
        AccountEditorComponent,
        TransactionReportComponent,
        StatusPipe,
    ],
    imports: [
        AppRoutingModule,
        NzIconModule.forRoot(icons),
        BrowserModule,
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
        NzStatisticModule,
    ],
    providers: [
        TypeService,
        AccountService,
        TransactionService,
        provideHttpClient()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
