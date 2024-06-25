import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { AssetType } from '@shared/models/asset-type.model';
import { AssetTypeService } from '@shared/services/asset-type.service';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-asset-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-type.component.html',
  styleUrl: './asset-type.component.css'
})
export class AssetTypeComponent {
  @Input ({required: true}) assetType!: AssetType;

  assetTypes = signal<AssetType[]>([]);

  private assetTypeService = inject(AssetTypeService);

  constructor(public modalService: ModalService) { }

  ngOnChanges() {
    this.getAssetTypes();
  }

  private getAssetTypes() {
    this.assetTypeService.getCategories()
    .subscribe({
      next: (assetType) => {
        this.assetTypes.set(assetType);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
