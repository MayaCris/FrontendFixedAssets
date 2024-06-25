import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '@shared/models/person.model';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private http = inject(HttpClient);

  constructor() { }

  getPersons () {
    const url = new URL('http://localhost:8070/fixed-Assets/api/responsiblePerson/all')
    return this.http.get<Person[]>(url.toString());
  }
}
