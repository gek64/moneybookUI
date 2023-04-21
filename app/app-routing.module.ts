import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {InvoiceComponent} from "./tables/invoice/invoice.component"
import {TypeComponent} from "./tables/type/type.component"
import {AccountComponent} from "./tables/account/account.component"
import {HomeComponent} from "./home/home.component"
import {InvoiceReportComponent} from "./reports/invoice-report/invoice-report.component"
import {LocationStrategy, PathLocationStrategy} from "@angular/common"

const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "invoice", component: InvoiceComponent},
    {path: "type", component: TypeComponent},
    {path: "account", component: AccountComponent},
    {path: "invoice-report", component: InvoiceReportComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    // 使用 hash 路由, 类似于 http://loaclhost/#/home 的路径形式
    // providers: [{provide: LocationStrategy, useClass: PathLocationStrategy}],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
