import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Person } from '@shared/models/person.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8070/fixed-Assets/api/responsiblePerson';
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  public personFormService!: FormGroup;

  private personFormSource = new BehaviorSubject<FormGroup>(
    this.fb.group({
      personIdD: [''],
      personNameD: [''],
      personDepartmentD: [''],
    }));

  clearPersonForm(): any {
    return {
      personIdD: '',
      personNameD: '',
      personDepartmentD: '',
    };
  }

  updatePersonForm(person: Person): void {
    const form = this.fb.group({
      personIdD: [person.personIdD || ''],
      personNameD: [person.personNameD || ''],
      personDepartmentD: [person.personDepartmentD || ''],

    });
    this.personFormSource.next(form);
  }

  personForm$ = this.personFormSource.asObservable();

  /**
   * Obtiene todas las personas registradas.
   * @returns Observable con la lista de personas registradas.
   */
  getPersons(): Observable<Person[]> {
    const url = new URL(`${this.apiUrl}/all`).toString()
    return this.http.get<Person[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPersonById(personIdD: string): Observable<Person> {
    const url = new URL(`${this.apiUrl}/personId/${personIdD}`).toString();
    return this.http.get<Person[]>(url)
      .pipe(
        map((person) => person[0]),
        catchError(this.handleError)
      );
  }

  /**
   * Guarda el registro de una persona nueva.
   * @param person Datos la persona a guardar.
   * @returns Observable con la respuesta de la API.
   */
  savePerson(person: Person): Observable<Person> {
    const url = new URL(`${this.apiUrl}/save`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.post<Person>(url, person, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza el registro de una persona.
   * @param personIdD ID de la persona a actualizar.
   * @param person Datos de la persona a actualizar.
   * @returns Observable con la respuesta de la API.
   * */
  updatePerson(personIdD: string, person: Person): Observable<Person> {
    const url = new URL(`${this.apiUrl}/update/${personIdD}`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    return this.http.put<Person>(url, person, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Borra el registro de una persona.
   * @param personIdD ID de la persona a borrar.
   * @returns Observable con la respuesta de la API.
   */
  deletePerson(personIdD: string): Observable<void> {
    const url = new URL(`${this.apiUrl}/delete/${personIdD}`).toString();
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Maneja los errores de las peticiones HTTP.
   * @param error Error de la petición HTTP.
   * @returns Observable con el error formateado.
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de la red
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
