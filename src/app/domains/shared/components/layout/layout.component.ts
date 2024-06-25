import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@shared/components/header/header.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [ RouterModule, CommonModule, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  
}
