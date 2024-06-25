import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, inject, signal } from '@angular/core';
import { Location } from '@shared/models/location.model';
import { LocationService } from '@shared/services/location.service';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export default class LocationComponent {
  @Input ({required: true}) location!: Location;

  locationsRecords = signal<Location[]>([]);

  // location = signal<Location | null>({
  //   locationIdDo: 0,
  //   locationNameD: "",
  //   locationAddressD: "",
  //   locationCityD: "",
  //   locationCountryD: "",
  // })

  private locationService = inject(LocationService);


  constructor(public modalService: ModalService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.getLocations();
  }

  private getLocations() {
    this.locationService.getLocations()
    .subscribe({
      next: (locationRecord) => {
        this.locationsRecords.set(locationRecord);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }


}
