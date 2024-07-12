import { Component, DoCheck, OnInit } from '@angular/core';
import 'zone.js';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldCvaComponent } from '../text-field-cva/text-field-cva.component';
import { ProfileCvaComponent } from '../profile-cva/profile-cva.component';
import { ProfileComponent } from '../profile/profile.component';
import { TextFieldComponent } from '../text-field/text-field.component';
import { IntermediateComponent } from '../intermediate/intermediate.component';
import { issueEligibilityValidator, issueTypeValidator } from '../validators';

@Component({
  selector: 'app-long-form-2',
  standalone: true,
  imports: [
    CommonModule,
    TextFieldComponent,
    TextFieldCvaComponent,
    ProfileComponent,
    ProfileCvaComponent,
    ReactiveFormsModule,
    FormsModule,
    IntermediateComponent,
  ],
  templateUrl: './long-form-2.component.html',
})
export class LongForm2Component implements OnInit, DoCheck {
  form: FormGroup = this.fb.group(
    {
      // testInput: this.fb.control<string>(''),
      issues: this.fb.array([], { updateOn: 'submit' }),
    }
    // { updateOn: 'submit' } // this option applies to all child AbstractControls and thus is overwritten by any children's updateOn option. Parent (but not sibling) AbstractControl's values and validations are always updated at the same time as child AbstractControls.
  );
  issues: FormArray<FormGroup> = this.form.get('issues') as FormArray;
  lifecycleTicks: number = 0;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.addIssue();
    this.form.valueChanges.subscribe((formValue) => console.log(formValue));
  }

  ngDoCheck() {
    console.log(++this.lifecycleTicks);
  }

  addIssue() {
    this.issues.push(
      this.fb.group(
        {
          issueType: this.fb.control<string | null>('', {
            validators: Validators.required,
            updateOn: 'blur',
          }),
          // eligibilityValidators: this.fb.control('', {
          //   asyncValidators: [issueEligibilityValidator], // async validation will only check issueTypeValidator and not sync validators from sibling controls
          // }),
        },
        {
          validators: [issueTypeValidator],
          asyncValidators: [issueEligibilityValidator],
          updateOn: 'submit',
        }
      )
    );
    console.log(this.form);
  }

  onCheckEligibility(issueForm: FormGroup) {
    if (issueForm.pending) return;

    (
      issueForm.get('eligibilityValidators') as FormControl
    ).updateValueAndValidity();
    issueForm.markAllAsTouched();
  }

  onSubmit(form: FormGroup): void {
    this.updateFormValueAndValidity(form); // async because of event emitter
    form.markAllAsTouched(); // async because of event emitter
    console.log('Marked form as touched:', form);

    if (form.valid) {
      // not triggered because updateFormValueAndValidity is async
      alert(form.value);
    }
  }

  private updateFormValueAndValidity(
    formControls: FormGroup | FormArray
  ): void {
    for (const control of Object.values(formControls.controls)) {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.updateFormValueAndValidity(control);
      } else {
        control.updateValueAndValidity();
      }
    }
  }

  onMarkAllAsTouched(formGroup: FormGroup) {
    formGroup.markAllAsTouched(); // async because of event emitter
    console.log('Marked form as touched:', formGroup);
  }
}
