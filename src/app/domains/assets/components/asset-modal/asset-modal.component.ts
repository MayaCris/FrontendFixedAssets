import { Component, Input, OnDestroy, OnInit, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '@shared/services/modal.service';
import { AssetService } from '@shared/services/asset.service';
import { Subscription} from 'rxjs';
import { Location } from '@shared/models/location.model';
import { LocationService } from '@shared/services/location.service';
import { PersonService } from '@shared/services/person.service';
import { AssetTypeService } from '@shared/services/asset-type.service';
import { Person } from '@shared/models/person.model';
import { AssetType } from '@shared/models/asset-type.model';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-asset-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './asset-modal.component.html',
  styleUrl: './asset-modal.component.css'
})
export default class AssetModalComponent implements OnInit, OnDestroy {

  isOpen = false;
  modalId = 'assetModal';

  locations = signal<Location[]>([]);
  persons = signal<Person[]>([]);
  categories = signal<AssetType[]>([]);

  assetForm!: FormGroup;

  private subscription!: Subscription;
  private assetService = inject(AssetService);

  constructor(
    private modalService: ModalService,
    private locationService: LocationService,
    private personService: PersonService,
    private assetTypeService: AssetTypeService
  ) { }

  ngOnInit() {
    this.manageModal();
    this.selectLocation();
    this.selectPerson();
    this.selectCategory();
    this.subscribeToAssetForm();
  }

  subscribeToAssetForm() {
    this.subscription.add(
      this.assetService.assetForm$.subscribe((form) => {
        this.assetForm = form;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getAssetById(assetIdD: number) {
    if (assetIdD) {
      this.assetService.getAssetById(assetIdD)
        .subscribe({
          next: (asset) => {
            this.assetService.updateAssetForm(asset);
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
      const voidAsset = this.assetService.clearAssetForm();
      this.assetService.updateAssetForm(voidAsset);
    }
  }

  manageModal() {
    this.subscription = this.modalService.modalState$.subscribe(state => {
      if (state.modalId === this.modalId) {
        this.isOpen = state.isOpen;
      }
    });
  }

  saveAsset() {
    if (this.assetForm.valid) {
      try {
        if (this.assetForm.get('assetIdD')?.value) {
          this.updateAsset();
        } else {
          this.assetService.saveAsset(this.assetForm.value)
            .subscribe({
              next: () => {
                alert('Asset created successfully: ' + this.assetForm.value.assetNameD);
                this.toggle(false)
              },
              error: (error) => {
                console.error('Error creating Asset:', error);
              }
            });
        }
      } catch (error) {
        console.error('Error creating Asset:', error);
      }
    }
  }

  updateAsset() {
    const assetIdD = this.assetForm.get('assetIdD')?.value;
    this.assetService.updateAsset(assetIdD, this.assetForm.value)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          alert('Asset updated successfully');
          this.toggle(false);
        },
        error: (error) => {
          console.error('Error updating Asset:', error);
        }
      });
  }

  selectLocation() {
    this.locationService.getLocations()
      .subscribe({
        next: (locations) => {
          this.locations.set(locations);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  selectPerson() {
    this.personService.getPersons()
      .subscribe({
        next: (persons) => {
          this.persons.set(persons);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

  selectCategory() {
    this.assetTypeService.getCategories()
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
        },
        error: (error) => {
          console.error(error);
        }
      })
  }

}
