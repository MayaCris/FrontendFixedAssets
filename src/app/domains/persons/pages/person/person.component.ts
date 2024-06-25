import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges, inject, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { Person } from '@shared/models/person.model';
import { ModalService } from '@shared/services/modal.service';
import { PersonService } from '@shared/services/person.service';
import { Subscription } from 'rxjs';
import { PersonModalComponent } from '../../components/person-modal/person-modal.component';

@Component({
  selector: 'app-person',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, PersonModalComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export default class PersonComponent {
  @Input({ required: true }) person!: Person;

  persons = signal<Person[]>([]);

  private subscription: Subscription = new Subscription();
  private personService = inject(PersonService);

  constructor(public modalService: ModalService) { }

  ngOnInit() {
    this.getPersons();
    this.subscribeToPersonForm();
  }

  ngOnChanges() {
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

  subscribeToPersonForm() {
    this.subscription.add(
      this.personService.personForm$.subscribe(() => {
        this.getPersons();
      })
    );
  }

  deletePerson(personIdD: string): void {
    if (confirm('Are you sure you want to delete this person?')) {
      this.personService.deletePerson(personIdD)
        .subscribe({
          next: () => {
            alert('Person deleted successfully');
            this.getPersons();
          },
          error: (error) => {
            console.error(error);
          }
        })
    }
  }

  openPersonModal(personIdD?: string): void {
    if(personIdD !== undefined) {
      this.updatePerson(personIdD);
    }
    this.modalService.toggleModal('personModal', true);
  }

  updatePerson(personIdD: string): void {
    this.personService.getPersonById(personIdD)
      .subscribe(
        (person) => {
          this.personService.updatePersonForm(person);
        });
  }
  
}
