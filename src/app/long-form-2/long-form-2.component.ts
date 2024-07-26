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
import { requiredEligibilityFieldsValidator, eligibilityValidator } from './validators';
import { ProfileComponent, ProfileForm } from '../components/profile/profile.component';
import { distinctUntilChanged, first, tap } from 'rxjs';

export interface IssueForm {
  eligibility: FormGroup<EligibilityForm>;
  eligibilityValidators: FormControl<null>;
  isEligibilityChecked: FormControl<boolean>;
  shouldShowProfileForm: FormControl<boolean>;
  profile: FormGroup<ProfileForm | {}>;
}

export interface EligibilityForm {
  issueType: FormControl<string>;
  isEligible: FormControl<boolean | null>;
}

@Component({
  selector: 'app-long-form-2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldCvaComponent,
    ProfileComponent
  ],
  templateUrl: './long-form-2.component.html',
})
export class LongForm2Component implements OnInit, DoCheck {
  form = this.fb.group(
    {
      // testInput: this.fb.control<string>(''),
      issues: this.fb.array<FormGroup<IssueForm>>([], { updateOn: 'submit' }),
    }
    // This option applies to all child AbstractControls and thus is overwritten by any children's updateOn option. 
    // Parent (but not sibling) AbstractControl's values and validations are always updated at the same time as child AbstractControls.
    // { updateOn: 'submit' }
  );
  issues = this.form.get('issues') as FormArray<FormGroup<IssueForm>>;
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
    const newIssue = this.fb.group<IssueForm>({
      eligibility: this.fb.group<EligibilityForm>(
        {
          issueType: this.fb.nonNullable.control<string>('', {
            validators: Validators.required,
          }),
          isEligible: this.fb.control<boolean | null>(null, {
            validators: Validators.required,
            updateOn: 'change'
          }),
        },
        // {
          //   validators: [issueTypeValidator],
          //   asyncValidators: [issueEligibilityValidator],
          //   updateOn: 'submit',
          // }
      ),
      eligibilityValidators: this.fb.control<null>(null, {
        validators: [requiredEligibilityFieldsValidator],
        asyncValidators: [eligibilityValidator], // async validation will only check issueTypeValidator and not sync validators from sibling controls
        // updateOn: 'submit' this updateOn option does not matter since none of these events are triggered if view value is the same as the model value - need to call updateValueAndValidity manually
      }),
      isEligibilityChecked: this.fb.nonNullable.control<boolean>(false),
      shouldShowProfileForm: this.fb.nonNullable.control<boolean>(false),
      profile: this.fb.group({}),
    },
    { updateOn: 'blur' }
    );

    (newIssue.get('eligibility') as FormGroup<EligibilityForm>).valueChanges.subscribe((formValue) => {
      (newIssue.get('isEligibilityChecked') as FormControl).setValue(false)
      console.log(formValue);
    });
    const subscriptionToShowProfileForm = (newIssue.get('eligibilityValidators') as FormControl)
      .statusChanges
      .pipe(distinctUntilChanged())
      .subscribe(status => {
        console.log('status:', status);
        if (status === 'VALID') {
          (newIssue.get('shouldShowProfileForm') as FormControl).setValue(true);
          subscriptionToShowProfileForm.unsubscribe();
        }
      });
    this.issues.push(newIssue);
    console.log(this.form);
  }

  onCheckEligibility(issueForm: FormGroup<IssueForm>) {
    if (issueForm.pending) return;

    (issueForm.get('eligibilityValidators') as FormControl).updateValueAndValidity();
    (issueForm.get('isEligibilityChecked') as FormControl).setValue(true);
    (issueForm.get('eligibility') as FormGroup<EligibilityForm>).markAllAsTouched();
    // Doesn't work because of async validation
    // if ((issueForm.get('eligibilityValidators') as FormControl).valid) {
    //   (issueForm.get('shouldShowProfileForm') as FormControl).setValue(true);
    // }
  }

  shouldShowAsEligible(issueForm: FormGroup<IssueForm>): boolean {
    let showEligible = (issueForm.get('isEligibilityChecked') as FormControl)?.value &&
      (issueForm.get('eligibilityValidators') as FormControl)?.valid;
    return showEligible;
  }

  shouldShowAsIneligible(issueForm: FormGroup<IssueForm>): boolean {
    let showIneligible = (issueForm.get('isEligibilityChecked') as FormControl).value &&
      !(issueForm.get('eligibilityValidators') as FormControl).valid;
    return showIneligible;
  }

  onSubmit(form: FormGroup): void {
    // TODO: Set all isEligibilityChecked FormControls to true to show the Eligibility badge for all issue forms
    
    // 1. For all updateOn options, updateValueAndValidity is not called internally by any of the events unless the value in the input (view) has actually changed from the input in the model.
    //   - For updateOn: 'submit', I just need to bind [formGroup] to the root form for the submit button click to update all nested form controls with this option
    //   - https://stackoverflow.com/questions/57452687/angular-6-reactive-forms-updateon-submit-is-not-updating-value-after-submit	
    //   - Note: Listening to ngSubmit or submit event in the template is not required.
    // 2. On the other hand, changing the value programmatically using setValue DOES call updateValueAndValidity internally
    //   - BUT, setValue does not change TOUCHED or PRISTINE status (seems like these can only be changed by events in the view) - touched changed onblur, pristine changed onchange
    //   - I think Pristine/Dirty value is updated separately and has no bearing on if updateValueAndValidity is called or how it is called.
    this.updateFormValueAndValidity(form); // async because of event emitter
    form.markAllAsTouched(); // async because of event emitter
    console.log('Marked form as touched:', form);

    if (form.valid) {
      // not triggered on the first time because emitted events to update parent form are async
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
        // TODO: Set all isEligibilityChecked FormControls to true to show the Eligibility badge for all issue forms
      }
    }
  }

  onMarkAllAsTouched(formGroup: FormGroup) {
    formGroup.markAllAsTouched(); // async because of event emitter
    console.log('Marked form as touched:', formGroup);
  }
}
