import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, inject, signal } from '@angular/core';
import { Depreciation } from '@shared/models/depreciation.model';
import { ModalService } from '@shared/services/modal.service';
import { AssetService } from '@shared/services/asset.service';
import { DepreciationService } from '@shared/services/depreciation.service';
import { RouterLinkWithHref } from '@angular/router';
import AssetModalComponent from '@assets/components/asset-modal/asset-modal.component';
import DepreciationModalComponent from '@depreciations/components/depreciation-modal/depreciation-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-depreciation',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, AssetModalComponent, DepreciationModalComponent],
  templateUrl: './depreciation.component.html',
  styleUrl: './depreciation.component.css'
})
export default class DepreciationComponent {

  @Input({ required: true }) depreciation!: Depreciation;

  depreciations = signal<Depreciation[]>([]);
  private subscription: Subscription = new Subscription();

  private depreciationService = inject(DepreciationService);

  constructor(public modalService: ModalService) { }

  ngOnInit() {
    this.subscribeToDepreciationForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getDepreciations();
  }

  private getDepreciations() {
    this.depreciationService.getDepreciations()
      .subscribe({
        next: (depreciations) => {
          this.depreciations.set(depreciations);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  subscribeToDepreciationForm() {
    this.subscription.add(
      this.depreciationService.depreciationForm$.subscribe(() => {
        this.getDepreciations();
      })
    );
  }

  openModalDepreciation(depreciationIdD: number): void {
    this.modalService.toggleModal('depreciationModal', true);
    this.callDepreciation(depreciationIdD);
  }

  callDepreciation(depreciationIdD: number){
    this.depreciationService.getDepreciationById(depreciationIdD)
      .subscribe({
        next: (depreciation) => {
          this.depreciationService.updateDepreciationForm(depreciation);
        }
    });
  }
  

  deleteDepreciation(depreciationIdD: number) {
    if (confirm('Are you sure you want to delete this depreciation?')) {
      this.depreciationService.deleteDepreciation(depreciationIdD)
        .subscribe({
          next: () => {
            alert('Depreciation deleted successfully');
            this.getDepreciations();
          },
          error: (error) => {
            console.error(error);
          }
        });
    }
  }


}
