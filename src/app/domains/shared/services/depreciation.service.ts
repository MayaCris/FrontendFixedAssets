import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Depreciation } from '@shared/models/depreciation.model';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class DepreciationService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8070/fixed-Assets/api/depreciation';
  private fb = inject(FormBuilder);

  public depreciationFormService!: FormGroup;

  public assetIdD!: number;

  public depreciationFormSource = new BehaviorSubject<FormGroup>(
    this.fb.group({
    depreciationIdD: [''],
    assetIdD: [''],
    depreciationValueD: [''],
    depreciationDateD: ['']
  }));

  clearDepreciationForm(): any {
    return {
      assetIdD: '',
      depreciationValueD: '',
      depreciationDateD: ''
    };
  }

  updateDepreciationForm(depreciation: Depreciation): void {
    const form = this.fb.group({
      depreciationIdD: [depreciation.depreciationIdD || ''],
      assetIdD: [depreciation.assetIdD || ''],
      depreciationValueD: [depreciation.depreciationValueD || ''],
      depreciationDateD: [depreciation.depreciationDateD || '']
    });
    this.depreciationFormSource.next(form);
  }

  depreciationForm$ = this.depreciationFormSource.asObservable();


  getDepreciations(): Observable<Depreciation[]> {
    const url = new URL(`${this.apiUrl}/all`).toString();
    return this.http.get<Depreciation[]>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  getDepreciationById (depreciationIdD: number): Observable<Depreciation> {
    const url = new URL(`${this.apiUrl}/DepreciationId/${depreciationIdD}`).toString();
    return this.http.get<Depreciation[]>(url)
    .pipe(map((depreciation) => depreciation[0]), catchError(this.handleError)
    );
  }

  getDepreciationsByAssetId (assetIdD: number): Observable<Depreciation[]> {
    const url = new URL(`${this.apiUrl}/byAssetId/${assetIdD}`).toString();
    return this.http.get<Depreciation[]>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  addDepreciation (depreciation: Depreciation): Observable<Depreciation> {
    const url = new URL(`${this.apiUrl}/save`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Depreciation>(url, depreciation, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  deleteDepreciation (depreciationIdD: number): Observable<void> {
    const url = new URL(`${this.apiUrl}/delete/${depreciationIdD}`).toString();
    return this.http.delete<void>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  updateDepreciation (depreciationIdD: number, depreciation: Depreciation): Observable<Depreciation> {
    const url = new URL(`${this.apiUrl}/update/${depreciationIdD}`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Depreciation>(url, depreciation, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

    /**
   * Maneja errores en solicitudes HTTP.
   * @param error Error HTTP.
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
