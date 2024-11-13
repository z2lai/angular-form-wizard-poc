import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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

export interface ProfileForm {
  first: FormControl<string>;
  last: FormControl<string>;
  gender: FormControl<string>;
  genderOther: FormControl<string>;
}

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

  form: FormGroup<ProfileForm> = this.fb.group(
    {
      first: this.fb.nonNullable.control('', { validators: Validators.required }),
      last: this.fb.nonNullable.control('', { validators: Validators.required }),
      gender: this.fb.nonNullable.control(
        '', 
        { 
          validators: Validators.required,
          updateOn: 'change'
        }),
      // TODO: Implement conditional validator on genderOther control
      genderOther: this.fb.nonNullable.control(''),
    },
    { 
      validators: this.allRequiredFieldsFilled,
      updateOn: 'change', 
    },
  );
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
    this.parentFormGroup.setControl(this.controlKey, this.form);
    // setTimeout(()=> console.log('Timeout Event!'), 1); //this works only for default change detection

    // this works to trigger CD but gives error on first formControlName "Cannot find control with path: 'issues -> first'"
    // probably because child CVA controls are trying to find their CVA when it hasn't yet been attached to the parent form due to setTimeOut
    // setTimeout(()=> {
    //   this.parentFormGroup.setControl(this.controlKey, this.form);
    //   console.log('trigger CD!');
    // }, 1);
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey);
  }

  onUpdateValue() {
    console.log(this.form);
    this.form.updateValueAndValidity();
  }

  // Note: Parameter type must be of type AbstractControl as this function will be called with this type
  // and cannot automatically downcast to a subtype - will show error when calling fb.group(). 
  allRequiredFieldsFilled(control: AbstractControl): ValidationErrors | null {
    const controlValue = (control as FormGroup<ProfileForm>).value;
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
