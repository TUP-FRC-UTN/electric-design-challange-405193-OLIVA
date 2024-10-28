import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModuleType } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  private readonly http = inject(HttpClient);
  private apiUrl = "http://localhost:3000/module-types";

  getTypes(): Observable<ModuleType[]> {
    return this.http.get<ModuleType[]>(this.apiUrl);
  }
}
