import { Route } from '@angular/router';
import { LoginComponent } from '@chat/login';
import { RegisterComponent } from '@chat/register';

export const appRoutes: Route[] = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
];