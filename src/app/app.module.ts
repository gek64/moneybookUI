import {NgModule} from "@angular/core"
import {NgOptimizedImage, registerLocaleData} from "@angular/common"
import {BrowserModule} from "@angular/platform-browser"
import {FormsModule} from "@angular/forms"
import zh from "@angular/common/locales/zh"
import {provideHttpClient} from "@angular/common/http"
import {NoopAnimationsModule} from "@angular/platform-browser/animations"

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

import {AppComponent} from "./app.component"
import {AppRoutingModule} from "./app-routing.module"
import {TypeService} from "../internal/service/type.service"
import {AccountService} from "../internal/service/account.service"
import {TransactionService} from "../internal/service/transaction.service"
import {TransactionComponent} from "./pages/tables/transaction/transaction.component"
import {TypeComponent} from "./pages/tables/type/type.component"
import {AccountComponent} from "./pages/tables/account/account.component"
import {HomeComponent} from "./pages/home/home.component"
import {TypeEditorComponent} from "./pages/tables/type/type-editor/type-editor.component"
import {TransactionReportComponent} from "./pages/reports/transaction-report/transaction-report.component"
import {TransactionEditorComponent} from "./pages/tables/transaction/transaction-editor/transaction-editor.component"
import {AccountEditorComponent} from "./pages/tables/account/account-editor/account-editor.component"
import {StatusPipe} from "./pipes/status.pipe"

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
