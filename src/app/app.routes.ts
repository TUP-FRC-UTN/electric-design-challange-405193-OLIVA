import { Routes } from '@angular/router';
import { BudgetListComponent } from './budget-list/budget-list.component';
import { BudgetFormComponent } from './budget-form/budget-form.component';

export const routes: Routes = [
    {
        path: 'budget-list', component: BudgetListComponent
    },
    {
        path: 'budget-form', loadComponent: () => import('./budget-form/budget-form.component').then(r => r.BudgetFormComponent)
    }
];
