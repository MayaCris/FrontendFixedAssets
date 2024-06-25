import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { Asset } from '@shared/models/asset.model';
import { AssetService } from '@shared/services/asset.service';
import { ModalService } from '@shared/services/modal.service';
import AssetModalComponent from '@assets/components/asset-modal/asset-modal.component';
import DepreciationModalComponent from '@depreciations/components/depreciation-modal/depreciation-modal.component';
import { DepreciationService } from '@shared/services/depreciation.service';
import { Depreciation } from '@shared/models/depreciation.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, AssetModalComponent, DepreciationModalComponent, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export default class ListComponent {

  public assets = new BehaviorSubject<Asset[]>([]);
  public assets$ = this.assets.asObservable();

  public buttonHide = false;

  assetService = inject(AssetService);
  depreciationService = inject(DepreciationService);

  private subscription: Subscription = new Subscription();

  constructor(public modalService: ModalService) { }

  ngOnInit() {
    this.getAssets();
    this.subscribeToAssetForm();
  }

  //Permite mantener la interfaz de activos actualizada luego de realizar cambios como agregar o editar un activo
  subscribeToAssetForm() {
    this.subscription.add(
      this.assetService.assetForm$.subscribe(() => {
        this.getAssets();
      })
    );
  }

  getAssets() {
    this.assetService.getAssetsOrderByDate()
      .subscribe({
        next: (assets) => {
          this.assets.next(assets);
        },
        error: (error) => {
          console.error('Error fetching assets:', error);
        }
      })
  }

  deleteAsset(assetIdD: number) {
    if (confirm('Are you sure you want to delete this asset?')) {
      this.checkDepreciations(assetIdD);
    }
  }

  checkDepreciations(assetIdD: number) {
    this.depreciationService.getDepreciationsByAssetId(assetIdD).subscribe({
      next: (depreciations: Depreciation[]) => {
        if (depreciations.length === 0) {
          this.handleDeletion(assetIdD);
        } else {
          alert('This asset has associated depreciations and cannot be deleted.');
        }
      },
      error: (error) => {
        console.error('Error checking depreciations:', error);
      }
    });
  }

  handleDeletion(assetIdD: number) {
    this.assetService.deleteAsset(assetIdD).subscribe({
      next: () => {
        this.getAssets();
        alert('Asset deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting asset:', error);
      }
    });
  }

  openModalAsset(assetId?: number): void {
    if (assetId !== undefined) {
      this.editAsset(assetId);
    }
    this.modalService.toggleModal('assetModal', true);
  }

  editAsset(assetId: number): void {
    this.assetService.getAssetById(assetId)
      .subscribe(
        (asset) => {
          this.assetService.updateAssetForm(asset);
        })
  }

  openModalDepreciation() {
    this.modalService.toggleModal('depreciationModal', true);
  }

  showButton(isChecked: boolean): void {
    if (isChecked) {
      this.buttonHide = true;
    } else {
      this.buttonHide = false;
    }
  }

  selectAsset(assetIdD: number, isChecked: boolean): void {
    if (isChecked) {
      this.showButton(isChecked);
      // Deseleccionar todos los demás checkboxes
      this.clearCheckStates();
      this.updateAssetCheckState(assetIdD, true);
      this.depreciationService.assetIdD = assetIdD;

    } else {
      this.showButton(isChecked);
      this.updateAssetCheckState(assetIdD, false);
    }
  }

  updateAssetCheckState(assetId: number, isChecked: boolean): void {
    const currentAssets = this.assets.getValue();
    const updatedAssets = currentAssets
      .map(asset => asset.assetIdD === assetId ?
        { ...asset, checkAsset: isChecked } :
        { ...asset, checkAsset: false }
      );
    this.assets.next(updatedAssets);
    console.log("updateAssetCheckState", updatedAssets);
    console.log("Este es el assetSubject", this.assets)
  }

  clearCheckStates(): void {
    const currentAssets = this.assets.getValue();
    const updatedAssets = currentAssets
      .map(asset => ({ ...asset, checkAsset: false }));
    this.assets.next(updatedAssets);
    console.log("clearCheckStates ", updatedAssets);
  }

}
