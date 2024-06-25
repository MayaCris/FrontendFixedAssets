import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';



@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export default class AboutComponent {

}
