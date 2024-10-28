import { Component, inject, OnInit } from '@angular/core';
import { Budget, ModuleType, Zone } from '../models/budget';
import { BudgetService } from '../services/budget.service';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [],
  templateUrl: './budget-list.component.html',
  styleUrl: './budget-list.component.css',
})
export class BudgetListComponent implements OnInit {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/components/lifecycle#
    - https://angular.dev/guide/http/making-requests#http-observables
    - https://angular.dev/guide/http/setup#providing-httpclient-through-dependency-injection
    - https://angular.dev/guide/http/making-requests#setting-request-headers
    - https://angular.dev/guide/http/making-requests#handling-request-failure
    - https://angular.dev/guide/http/making-requests#best-practices (async pipe)
    - https://angular.dev/guide/testing/components-scenarios#example-17 (async pipe)
  */

  private readonly budgetService = inject(BudgetService);

    budgets: Budget[] = [];

    ngOnInit(): void {
      this.budgetService.getBudgets().subscribe({
        next: (data) => {
          this.budgets = data.map(budget => ({
            ...budget,
            zoneMap: new Map<Zone, ModuleType[]>(
              Object.entries(budget.zoneMap).map(([key, value]) => [
                key as Zone, // Convertir la clave a tipo Zone
                value as ModuleType[] // Convertir el valor a tipo ModuleType[]
              ])
            )
          }));
        },
        error: (error) => {
          console.error('Error al obtener presupuestos:', error);
        }
      });
    }

    calculateBudgetModules(budget: Budget): number {
      if (!budget.zoneMap) return 0;
  
      let quantity = 0;
      budget.zoneMap.forEach((modules) => {
        quantity += modules.length;
      });
      return quantity;
    }
}
