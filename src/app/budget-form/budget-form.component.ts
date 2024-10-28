import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModuleService } from '../services/module.service';
import { Budget, ModuleType, Zone } from '../models/budget';
import { CommonModule } from '@angular/common';

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

  guardarBudget(){
    const budgetData: Budget = this.convertFormToBudget(this.budgetForm.value);
      //console.log('Formulario enviado:', budgetData);
    // if (this.budgetForm.valid) {
    //   const budgetData: Budget = this.convertFormToBudget(this.budgetForm.value);
    //   console.log('Formulario enviado:', budgetData);
    // }
  }

   // Convierte los datos del formulario a la estructura Budget
    private convertFormToBudget(formValue: any): Budget {
    const zoneMap = new Map<Zone, ModuleType[]>();
    formValue.zoneMap.forEach((zoneGroup: any) => {
      const zone = zoneGroup.zone;
      const modulesIds = zoneGroup.modules;
      const modules: ModuleType[] = [];
      modulesIds.forEach((id: number) => {
        modules.push(this.moduleTypeList.find(modulo => modulo.id === id) as ModuleType)
      })

      console.log(modules)
      zoneMap.set(zone, modules);
    });
    return {
      client: formValue.client,
      date: formValue.date,
      zoneMap
    };
  }
}
