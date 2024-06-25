import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { ModalService } from '@shared/services/modal.service';
import { PersonService } from '@shared/services/person.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-person-modal',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, ReactiveFormsModule],
  templateUrl: './person-modal.component.html',
  styleUrl: './person-modal.component.css'
})
export class PersonModalComponent {

  private personService = inject(PersonService);
  private subscription!: Subscription

  constructor(private modalService: ModalService) { }

  public isOpen = false;
  private modalId = 'personModal';

  public personForm!: FormGroup;

  ngOnInit() {
    this.manageModal();
    this.subscribeToPersonForm();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeToPersonForm() {
    this.subscription.add(
      this.personService.personForm$.subscribe((form) => {
        this.personForm = form;
      })
    );
  }

  savePerson() {
    if(this.personForm.valid) {
      try {
        if(this.personForm.get('personIdD')?.value) {
          this.updatePerson();
        } else {
          this.personService.savePerson(this.personForm.value)
            .subscribe({
              next: () => {
                alert('Person created successfully');
                this.toggle(false);
              },
              error: (error) => {
                console.error('Error creating person: ', error);
              }
            });
        }
      } catch (error) {
        console.error('Error creating person: ', error);
      }
    }
  }

  updatePerson() {
    const personId = this.personForm.get('personIdD')?.value;
    this.personService.updatePerson(personId, this.personForm.value)
      .subscribe({
        next: () => {
          alert('Person updated successfully');
          this.toggle(false);
        },
        error: (error) => {
          console.error('Error updating person: ', error);
        }
      });
  }

  toggle(open: boolean): void {
    this.modalService.toggleModal(this.modalId, open);
    if (!open) {
      const voidPerson = this.personService.clearPersonForm();
      this.personService.updatePersonForm(voidPerson);
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
