import { Route } from '@angular/router';
import { LoginComponent } from '@chat/login';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
];
