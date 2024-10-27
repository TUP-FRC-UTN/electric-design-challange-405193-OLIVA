import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModuleService } from '../services/module.service';
import { ModuleType } from '../models/budget';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */

  private readonly moduleService = inject(ModuleService);

  private subscriptions = new Subscription();
  private moduleTypes: ModuleType[] = [];

  budgetForm = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    fecha: new FormControl('')
  });

  ngOnInit(): void {
    this.subscriptions.add(
      this.moduleService.getTypes().subscribe((data: ModuleType[]) => {
        this.moduleTypes = data;
      })
    );
    console.log(this.moduleTypes)
  }
}
