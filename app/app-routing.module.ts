import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {InvoiceComponent} from "./invoice/invoice.component"
import {TypeComponent} from "./type/type.component"
import {AccountComponent} from "./account/account.component"
import {HomeComponent} from "./home/home.component"

const routes: Routes = [
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "home", component: HomeComponent},
    {path: "invoice", component: InvoiceComponent},
    {path: "type", component: TypeComponent},
    {path: "account", component: AccountComponent},
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
