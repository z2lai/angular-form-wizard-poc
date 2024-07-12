import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TextFieldCvaComponent } from '../text-field-cva/text-field-cva.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TextFieldCvaComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
})
export class ProfileComponent {
  @Input() controlKey = '';

  form!: FormGroup;
  genderOptions: string[] = [
    'Female',
    'Male',
    'Non-binary',
    'Gender non-conforming',
    'Prefer not to say',
    'Other',
  ];

  constructor(
    private fb: FormBuilder,
    private parentContainer: ControlContainer
  ) {}

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  get genderControl(): FormControl {
    return this.form.get('gender') as FormControl;
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        first: ['b', Validators.required],
        last: ['c', Validators.required],
        gender: ['Other', Validators.required],
        genderOther: [''],
      },
      { validators: this.allRequiredFieldsFilled }
    );
    this.parentFormGroup.setControl(this.controlKey, this.form);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }

  onUpdateValue() {
    console.log(this.form);
    this.form.updateValueAndValidity();
  }

  allRequiredFieldsFilled(control: AbstractControl): ValidationErrors | null {
    const controlValue = control.value;
    let isValid;
    if (controlValue) {
      isValid =
        controlValue.first &&
        controlValue.last &&
        controlValue.gender &&
        (controlValue.gender !== 'Other' || controlValue.genderOther);
    }
    return isValid ? null : { allRequired: true };
  }
}
