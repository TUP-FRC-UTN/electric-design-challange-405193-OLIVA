import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModuleService } from '../services/module.service';
import { Budget, ModuleType, Zone } from '../models/budget';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../services/budget.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent implements OnInit {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */

  private readonly moduleService = inject(ModuleService);
  private readonly budgetService = inject(BudgetService);
  private readonly router = inject(Router);
  private formBuilder: FormBuilder = new FormBuilder;

  zones = Object.values(Zone); // Extraemos las zonas del enum para usarlas en el formulario
  moduleTypeList: ModuleType[] = [];

  budgetForm: FormGroup = this.formBuilder.group({
    client: ['', Validators.required],
    date: ['', [Validators.required]],
    zoneMap: this.formBuilder.array([]) // Inicializa el FormArray vacío
  })

  // Getter para acceder al FormArray de zoneMap
  get zoneMap() {
    return this.budgetForm.get('zoneMap') as FormArray;
  }

  // Método para agregar una nueva zona con módulos
  agregarZona() {
    const zonaGroup = this.formBuilder.group({
      zone: ['', Validators.required], // Selector para la zona
      modules: this.formBuilder.array([]) // FormArray para los módulos
    });
    this.zoneMap.push(zonaGroup);
  }

  // Método para eliminar una zona
  eliminarZona(index: number) {
    this.zoneMap.removeAt(index);
  }

getModulesArray(indexZona:number): FormArray{
  return this.zoneMap.at(indexZona).get('modules') as FormArray;
}

  // Método para agregar un módulo en una zona específica
  agregarModulo(indexZona: number) {
    const modulesArray = this.zoneMap.at(indexZona).get('modules') as FormArray;
    const moduloGroup = this.formBuilder.group({
      id: [null, Validators.required],
      slots: [{value:0, disabled: true}, Validators.required],
      price: [{value:0, disabled: true}, Validators.required]
    });
    modulesArray.push(moduloGroup);
  }

  eliminarModulo(indexZona: number, indexModulo:number) {
    const modulesArray = this.zoneMap.at(indexZona).get('modules') as FormArray;
    modulesArray.removeAt(indexModulo);
  }

  ngOnInit(): void {
    // Llamada al servicio para obtener los tipos de módulo
    this.moduleService.getTypes().subscribe((modules) => {
      this.moduleTypeList = modules;
    });
  }

  onModuleSelect(indexZona: number, indexModulo: number) {
    const modulesArray = this.zoneMap.at(indexZona).get('modules') as FormArray;
    const selectedModuleId = modulesArray.at(indexModulo).get('id')?.value;
    const selectedModule = this.moduleTypeList.find(modulo => modulo.id === selectedModuleId);

    if (selectedModule) {
      modulesArray.at(indexModulo).get('slots')?.setValue(selectedModule.slots);
      modulesArray.at(indexModulo).get('price')?.setValue(selectedModule.price);
    }
  }

  guardarBudget() {
    console.log(this.budgetForm.valid);
    if (this.budgetForm.valid) {
      let budgetData: Budget = this.convertFormToBudget(this.budgetForm.value);
      console.log(budgetData)


      // Convierte zoneMap a un objeto simple
    const zoneMapObject: any = {};
    budgetData.zoneMap.forEach((modules, zone) => {
      zoneMapObject[zone] = modules;
    });
    budgetData = { ...budgetData, zoneMap: zoneMapObject };

      // Llama al servicio para postear el presupuesto
      this.budgetService.postBudget(budgetData).subscribe({
        next: (response) => {
          console.log('Presupuesto guardado:', response);
          // Redirige a la ruta 'budget-list' después de guardar
          this.router.navigate(['/budget-list']);
        },
        error: (error) => {
          console.error('Error al guardar el presupuesto:', error);
          alert('Hubo un error al guardar el presupuesto');
        }
      });
    }

  }

   // Convierte los datos del formulario a la estructura Budget
  private convertFormToBudget(formValue: any): Budget {
    const budget: Budget = {
      client: formValue.client,
      date: formValue.date,
      zoneMap: new Map<Zone, ModuleType[]>()
    };
  
    const zones = this.zoneMap.controls; // Asumiendo que `zoneMap` es un FormArray
    for (let i = 0; i < zones.length; i++) {
      const zoneControl = zones.at(i);
      if (!zoneControl) continue; // Si zoneControl es undefined, continúa al siguiente
  
      const zone = zoneControl.get('zone')?.value;
      const modules = this.getModulesArray(i);
  
      const moduleTypes: ModuleType[] = [];
      for (let j = 0; j < modules.length; j++) {
        const moduleId = modules.at(j).get('id')?.value;
        const selectedModule = this.moduleTypeList.find(mod => mod.id === moduleId);
  
        if (selectedModule) {
          moduleTypes.push(selectedModule);
        }
      }
  
      if (zone) {
        budget.zoneMap.set(zone, moduleTypes);
      }
    }
  
    return budget;
  }
}
