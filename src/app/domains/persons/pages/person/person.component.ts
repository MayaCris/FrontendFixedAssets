import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, inject, signal } from '@angular/core';
import { Person } from '@shared/models/person.model';
import { ModalService } from '@shared/services/modal.service';
import { PersonService } from '@shared/services/person.service';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent {
  @Input ({required: true}) person!: Person;

  persons = signal<Person[]>([]);

  

  private personService = inject(PersonService);

  constructor( public modalService: ModalService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.getPersons();
  }

  private getPersons() {
    this.personService.getPersons()
    .subscribe({
      next: (person) => {
        this.persons.set(person);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }
  
}
