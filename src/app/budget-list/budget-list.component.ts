import { Component, OnInit } from '@angular/core';
import { Budget, Zone } from '../models/budget';

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

    budgets: Budget[] = [];

    ngOnInit(): void {
      
    }

    calculateBudgetModules(budget: Budget): number {
      let quantity = 0;

      budget.zoneMap.forEach((modules) => {
        quantity += modules.length;
      });

      return quantity;
    }
}
