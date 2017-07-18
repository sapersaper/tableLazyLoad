import { Routes } from '@angular/router';

import { Error404Component } from './errors/error404/error404.component';
import { GridComponent } from './grid/grid.component';
import { HomeComponent } from './home/home.component';
import { CallServiceComponent } from './call-service/call-service.component';

export const appRoutes: Routes = [
    {path: 'grid', component: GridComponent},
    {path: '404', component: Error404Component},
    {path: 'home', component: HomeComponent},
    {path: 'service', component: CallServiceComponent},
    {path: '' , redirectTo: '/home', pathMatch: 'full'}
];