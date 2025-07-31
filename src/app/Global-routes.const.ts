import { Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RouteIndexComponent } from './views/routes/route-index/route-index.component';
import { AuthGuard } from './_helpers/auth.gaurd';

export const GlobalRoutes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
    },
    {

        path: "login",
        component: LoginComponent,
        children: [{
            path: '',
            loadChildren: () =>
                import("./views/auth/auth.module").then(
                    m => m.AuthModule
                )
        }]
    },
    {

        path: "user",
        //   canActivate: [AuthGuard],

        component: RouteIndexComponent,
        children: [{
            path: '',
            loadChildren: () =>
                import("./views/routes/routes.module").then(
                    m => m.RoutesModule
                )
        }]
    },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
]
