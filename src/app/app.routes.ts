import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UpateWindowComponent } from './upate-window/upate-window.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "update", component: UpateWindowComponent }
];
