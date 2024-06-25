import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Location } from '@shared/models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private http = inject(HttpClient);


  constructor() { }

  getLocations () {
    const url = new URL('http://localhost:8070/fixed-Assets/api/location/all')
    return this.http.get<Location[]>(url.toString());
  }
}
