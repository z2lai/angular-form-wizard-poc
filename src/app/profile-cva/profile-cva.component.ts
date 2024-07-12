import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormGroup,
  Validators,
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  NG_VALIDATORS,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { TextFieldCvaComponent } from '../text-field-cva/text-field-cva.component';

@Component({
  selector: 'app-profile-cva',
  standalone: true,
  imports: [TextFieldCvaComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './profile-cva.component.html',
  styleUrls: ['./profile-cva.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ProfileCvaComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ProfileCvaComponent,
    },
  ],
})
export class ProfileCvaComponent
  implements OnInit, OnDestroy, ControlValueAccessor, Validator
{
  form!: FormGroup;

  genderOptions: string[] = [
    'Female',
    'Male',
    'Non-binary',
    'Gender non-conforming',
    'Prefer not to say',
    'Other',
  ];

  onTouched: () => void = () => {};
  onChange: (value: any) => void = () => {};
  subscriptions: Subscription;

  constructor(public cdRef: ChangeDetectorRef, private fb: FormBuilder) {
    this.subscriptions = new Subscription();
  }

  get genderControl(): FormControl {
    return this.form.get('gender') as FormControl;
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        first: ['b', Validators.required],
        last: ['c', Validators.required],
        gender: ['Male', Validators.required],
        genderOther: [''],
      },
      { validators: this.allRequiredFieldsFilled }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onDetectChanges() {
    console.log(this.form);
    this.cdRef.detectChanges();
  }

  onUpdateValue() {
    console.log(this.form);
    this.form.updateValueAndValidity();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.allRequiredFieldsFilled(control);
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

  writeValue(value: any): void {
    value && this.form.setValue(value, { emitEvent: false });
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.subscriptions.add(this.form.valueChanges.subscribe(onChange));
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    disabled ? this.form.disable() : this.form.enable();
  }
}
