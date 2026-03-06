
import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Homepage } from './pages/homepage/homepage';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },
  { path: 'homepage', component: Homepage },
  { path: 'dashboard', component: Dashboard },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: '**', redirectTo: 'dashboard' }
];

