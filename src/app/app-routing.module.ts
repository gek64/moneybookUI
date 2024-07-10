import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {TransactionComponent} from "./component/tables/transaction/transaction.component"
import {TypeComponent} from "./component/tables/type/type.component"
import {AccountComponent} from "./component/tables/account/account.component"
import {HomeComponent} from "./component/home/home.component"
import {TransactionReportComponent} from "./component/reports/transaction-report/transaction-report.component"

const routes: Routes = [
    {path: "", redirectTo: "home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "transaction", component: TransactionComponent},
    {path: "type", component: TypeComponent},
    {path: "account", component: AccountComponent},
    {path: "transaction-report", component: TransactionReportComponent},
]

@NgModule({
    // 使用 hash 路由, 类似于 http://loaclhost/#/home 的路径形式
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
