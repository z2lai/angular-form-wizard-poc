import { Component, DoCheck, OnInit } from '@angular/core';
import 'zone.js';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldCvaComponent } from '../components/text-field-cva/text-field-cva.component';
import { allRequiredFieldsFilled, issueEligibilityValidator, issueTypeValidator } from './validators';

@Component({
  selector: 'app-long-form-2',
  standalone: true,
  imports: [
    CommonModule,
    TextFieldCvaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './long-form-2.component.html',
})
export class LongForm2Component implements OnInit, DoCheck {
  form: FormGroup = this.fb.group(
    {
      // testInput: this.fb.control<string>(''),
      issues: this.fb.array([], { updateOn: 'submit' }),
    }
    // This option applies to all child AbstractControls and thus is overwritten by any children's updateOn option. 
    // Parent (but not sibling) AbstractControl's values and validations are always updated at the same time as child AbstractControls.
    // { updateOn: 'submit' }
  );
  issues: FormArray<FormGroup> = this.form.get('issues') as FormArray;
  lifecycleTicks: number = 0;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    this.addIssue();
    this.form.valueChanges.subscribe((formValue) => {
      console.log(formValue);
    });
  }

  ngDoCheck() {
    console.log(++this.lifecycleTicks);
  }

  addIssue() {
    const newIssue = this.fb.group(
      {
        issueType: this.fb.control<string | null>('a', {
          validators: Validators.required,
          updateOn: 'blur',
        }),
        eligibilityValidators: this.fb.control(null, {
          validators: [allRequiredFieldsFilled, issueTypeValidator],
          asyncValidators: [issueEligibilityValidator], // async validation will only check issueTypeValidator and not sync validators from sibling controls
          updateOn: 'submit',
        }),
        isEligibilityChecked: this.fb.control(false),
      },
      // {
      //   validators: [issueTypeValidator],
      //   asyncValidators: [issueEligibilityValidator],
      //   updateOn: 'submit',
      // }
    );
    newIssue.get('issueType')?.valueChanges.subscribe((formValue) => {
      // debugger;
      newIssue.get('isEligibilityChecked')?.setValue(false)
      console.log(formValue);
    });
    this.issues.push(newIssue);
    console.log(this.form);
  }

  onCheckEligibility(issueForm: FormGroup) {
    if (issueForm.pending) return;
// debugger;
    (issueForm.get('eligibilityValidators') as FormControl).updateValueAndValidity();
    (issueForm.get('isEligibilityChecked') as FormControl).setValue(true);
    issueForm.markAllAsTouched();
  }

  shouldShowAsEligible(issueForm: FormGroup): boolean {
    let showEligible = issueForm.get('isEligibilityChecked')?.value &&
      issueForm.get('eligibilityValidators')?.valid;
    console.log(showEligible);
    return showEligible;
  }

  shouldShowAsIneligible(issueForm: FormGroup): boolean {
    let showEligible = issueForm.get('isEligibilityChecked')?.value &&
      !issueForm.get('eligibilityValidators')?.valid;
    console.log(showEligible);
    return showEligible;
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
