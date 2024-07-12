import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-field.component.html',
  styleUrl: './text-field.component.css',
})
export class TextFieldComponent {
  @Input() control = new FormControl('');
}
