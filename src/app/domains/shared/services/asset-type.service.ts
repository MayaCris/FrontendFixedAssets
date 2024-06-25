import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AssetType } from '@shared/models/asset-type.model';

@Injectable({
  providedIn: 'root'
})
export class AssetTypeService {
  private http = inject(HttpClient);


  constructor() { }

  getCategories () {
    const url = new URL('http://localhost:8070/fixed-Assets/api/assetType/all')
    return this.http.get<AssetType[]>(url.toString());
  }
}
