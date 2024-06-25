import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface ModalState {
  modalId: string;
  isOpen: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalState = new BehaviorSubject<ModalState>({ modalId: '', isOpen: false });

  modalState$: Observable<ModalState> = this.modalState.asObservable();


  toggleModal(modalId: string, isOpen: boolean): void {
    this.modalState.next({ modalId, isOpen });
  }


}