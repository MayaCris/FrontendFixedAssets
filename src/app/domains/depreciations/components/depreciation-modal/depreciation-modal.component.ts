import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';
import { DepreciationService } from '@shared/services/depreciation.service';
import { RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-depreciation-modal',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, ReactiveFormsModule],
  templateUrl: './depreciation-modal.component.html',
  styleUrl: './depreciation-modal.component.css'
})
export default class DepreciationModalComponent implements OnInit, OnDestroy {

  private depreciationService = inject(DepreciationService);
  private subscription!: Subscription

  constructor(private modalService: ModalService) { }

  public isOpen = false;
  private modalId = 'depreciationModal';

  public depreciationForm!: FormGroup;

  ngOnInit() {
    this.manageModal();
    this.subscribeToDepreciationForm();
  }

  subscribeToDepreciationForm() {
    this.subscription.add(
      this.depreciationService.depreciationForm$.subscribe((form) => {
        this.depreciationForm = form;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  saveDepreciation() {
    this.depreciationForm.patchValue({ assetIdD: this.depreciationService.assetIdD });
    if (this.depreciationForm.valid) {
      console.log(this.depreciationForm.value);
      try {
        if (this.depreciationForm.get('depreciationIdD')?.value) {
          this.updateDepreciation();
        } else {
          this.depreciationService.addDepreciation(this.depreciationForm.value)
            .subscribe({
              next: () => {
                alert('Depreciation created successfully');
                this.toggle(false);
              },
              error: (error) => {
                console.error('Error creating Depreciation', error);
              }
            });
        }
      } catch (error) {
        console.error('Error creating depreciation:', error);
      }
    }
  }

  updateDepreciation() {
    const depreciationIdD = this.depreciationForm.get('depreciationIdD')?.value;
    this.depreciationService.updateDepreciation(depreciationIdD, this.depreciationForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          alert('Depreciation updated successfully');
          this.toggle(false);
        },
        error: (error: any) => {
          console.error('Error updating Depreciation', error);
        }
      });
  }

  depreciationById(depreciationIdD: number) {
    if (depreciationIdD) {
      this.depreciationService.getDepreciationById(depreciationIdD)
        .subscribe({
          next: (depreciation) => {
            this.depreciationService.updateDepreciationForm(depreciation);
          },
          error: (error) => {
            console.error(error);
          }
        })
    }
  }

  toggle(open: boolean): void {
    this.modalService.toggleModal(this.modalId, open);
    if (!open) {
      const voidDepreciation = this.depreciationService.clearDepreciationForm();
      this.depreciationService.updateDepreciationForm(voidDepreciation);
    }

  }

  manageModal() {
    this.subscription = this.modalService.modalState$.subscribe(state => {
      if (state.modalId === this.modalId) {
        this.isOpen = state.isOpen;
      }
    });
  }

}
