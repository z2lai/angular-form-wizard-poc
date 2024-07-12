import { Component } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-intermediate',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './intermediate.component.html',
  styleUrl: './intermediate.component.css',
})
export class IntermediateComponent {}
