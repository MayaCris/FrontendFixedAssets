import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Asset } from '@shared/models/asset.model';
import { BehaviorSubject, Observable, Subject, catchError, map, throwError } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private apiUrl = 'http://localhost:8070/fixed-Assets/api/fixedAsset';
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  public assetFormService!: FormGroup;

  private assetFormSource = new BehaviorSubject<FormGroup>(
    this.fb.group({
    assetIdD: [''],
    assetCodeD: [''],
    assetNameD: [''],
    assetDescriptionD: [''],
    typeIdD: [''],
    acquisitionDateD: [''],
    acquisitionValueD: [''],
    locationIdD: [''],
    personIdD: ['']
  }));

  clearAssetForm(): any {
    return {
      assetNameD: '',
      assetCodeD: '',
      assetDescriptionD: '',
      acquisitionDateD: '',
      acquisitionValueD: '',
      locationIdD: '',
      personIdD: '',
      typeIdD: ''
    };
  }

  updateAssetForm(asset: Asset): void {
    const form = this.fb.group({
      assetIdD: [asset.assetIdD || ''],
      assetCodeD: [asset.assetCodeD || ''],
      assetNameD: [asset.assetNameD || ''],
      assetDescriptionD: [asset.assetDescriptionD || ''],
      typeIdD: [asset.typeIdD || ''],
      acquisitionDateD: [asset.acquisitionDateD || ''],
      acquisitionValueD: [asset.acquisitionValueD || ''],
      locationIdD: [asset.locationIdD || ''],
      personIdD: [asset.personIdD || '']
    });
    this.assetFormSource.next(form);
  }
  
  assetForm$ = this.assetFormSource.asObservable();

  /**
   * Obtiene todos los activos fijos.
   * @returns Observable con la lista de activos fijos.
   */
  getAssets(): Observable<Asset[]> {
    const url = new URL(`${this.apiUrl}/all`).toString()
    return this.http.get<Asset[]>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene todos los activos fijos ordenados por fecha de adquisición.
   * @returns Observable con la lista de activos fijos ordenados por fecha de adquisición.
  **/
  getAssetsOrderByDate(): Observable<Asset[]> {
    const url = new URL(`${this.apiUrl}/allOrderByAcquisitionDate`).toString()
    return this.http.get<Asset[]>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un activo fijo por ID.
   * @param assetIdD ID del activo fijo.
   * @returns Observable con el activo fijo.
   */
  getAssetById (assetIdD: number): Observable<Asset> {
    const url = new URL(`${this.apiUrl}/findById/${assetIdD}`).toString();
    return this.http.get<Asset[]>(url)
    .pipe(
      map((asset) => asset[0]), 
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un activo fijo por ID.
   * @param assetIdD ID del activo fijo.
   * @returns Observable con la respuesta de la API.
   */
  deleteAsset (assetIdD: number): Observable<void> {
    const url = new URL(`${this.apiUrl}/delete/${assetIdD}`).toString();
    return this.http.delete<void>(url)
    .pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Guarda un nuevo activo fijo.
   * @param asset Datos del activo fijo a guardar.
   * @returns Observable con la respuesta de la API.
   */
  saveAsset(asset: Asset): Observable<Asset> {
    const url = new URL (`${this.apiUrl}/save`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Asset>(url, asset, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  /**
   * Actualiza un activo fijo por ID.
   * @param assetIdD ID del activo fijo.
   * @param asset Datos del activo fijo a actualizar.
   * @returns Observable con la respuesta de la API.
   */
  updateAsset(assetIdD: number, asset: Asset): Observable<Asset> {
    const url = new URL(`${this.apiUrl}/update/${assetIdD}`).toString();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.put<Asset>(url, asset, httpOptions)
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
