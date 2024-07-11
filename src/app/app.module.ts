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
import {NzIconModule} from "ng-zorro-antd/icon"
import {HomeOutline, SearchOutline, TableOutline} from "@ant-design/icons-angular/icons"

// 页面模块
import {AppComponent} from "./app.component"
import {AppRoutingModule} from "./app-routing.module"
import {StatusPipe} from "./pipe/status.pipe"
import {TransactionComponent} from "./component/transaction/transaction.component"
import {TypeComponent} from "./component/type/type.component"
import {AccountComponent} from "./component/account/account.component"
import {HomeComponent} from "./component/home/home.component"
import {TypeEditorComponent} from "./component/type-editor/type-editor.component"
import {TransactionSearchComponent} from "./component/transaction-search/transaction-search.component"
import {TransactionEditorComponent} from "./component/transaction-editor/transaction-editor.component"
import {AccountEditorComponent} from "./component/account-editor/account-editor.component"

// http 服务
import {TypeService} from "./service/type.service"
import {AccountService} from "./service/account.service"
import {TransactionService} from "./service/transaction.service"

registerLocaleData(zh)

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        TransactionComponent,
        AccountComponent,
        TypeComponent,
        TypeEditorComponent,
        TransactionEditorComponent,
        AccountEditorComponent,
        TransactionSearchComponent,
        StatusPipe,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        NoopAnimationsModule,
        NgOptimizedImage,
        NzLayoutModule,
        NzMenuModule,
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
        NzIconModule.forRoot([HomeOutline, SearchOutline, TableOutline]),
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
