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
  shouldLockEligibilityForm: FormControl<boolean>;
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
    console.log(this.form);
    // Why does calling updateFormValueAndValidity without setTimeout only emit the PENDING state?
    // See https://github.com/angular/angular/issues/14542
    // setTimeout(() => this.updateFormValueAndValidity(this.form), 0);  
    this.form.valueChanges.subscribe((formValue) => {
      console.log('Form Value Updated:', formValue);
    });
    this.form.statusChanges.subscribe((formStatus) => {
      console.log('Form Status Updated:', formStatus);
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
      //TODO: Consider checking _pendingDirty/_pendingValue instead of this form control to manage view state: https://angularindepth.com/posts/1143/a-thorough-exploration-of-angular-forms
      isEligibilityChecked: this.fb.nonNullable.control<boolean>(false),
      shouldShowProfileForm: this.fb.nonNullable.control<boolean>(false),
      shouldLockEligibilityForm: this.fb.nonNullable.control<boolean>(false),
      profile: this.fb.group({}),
    },
    { updateOn: 'blur' }
    );

    // TODO: Since I have two different ways to set isEligibilityChecked to false, if input changed or Edit Info clicked
    // I should make isEligibilityChecked into an observable stream within this component class for declarative code,
    // but how would I use this since IsEligibilityChecked is currently in a FormControl.
    (newIssue.get('eligibility') as FormGroup<EligibilityForm>).valueChanges.subscribe((formValue) => {
      (newIssue.get('isEligibilityChecked') as FormControl).setValue(false)
    });

    (newIssue.get('eligibilityValidators') as FormControl)
      .statusChanges
      .subscribe(_ => {
        (newIssue.get('isEligibilityChecked') as FormControl).setValue(true);
        console.log('Eligibility Validators Updated!');
        console.log(newIssue);
      })

    const subscriptionToShowProfileForm = (newIssue.get('eligibilityValidators') as FormControl)
      .statusChanges
      .pipe(distinctUntilChanged())
      .subscribe(status => {
        console.log('Eligibility Status changed to:', status);
        if (status === 'VALID') {
          (newIssue.get('shouldShowProfileForm') as FormControl).setValue(true);
          // TODO: Right now imperatively managing the disabled property on each section, need to figure a declarative way
          // (newIssue.get('eligibility') as FormGroup).disable();
          (newIssue.get('shouldLockEligibilityForm') as FormControl).setValue(true);
          // subscriptionToShowProfileForm.unsubscribe();
        }
      });

    (newIssue.get('shouldLockEligibilityForm') as FormControl).valueChanges.subscribe((formValue) => {
      console.log('shouldLockEligibilityForm', formValue);
      if (formValue) {
        (newIssue.get('eligibility') as FormGroup).disable();
        (newIssue.get('profile') as FormGroup).enable();
      } else {
        (newIssue.get('eligibility') as FormGroup).enable();
        (newIssue.get('profile') as FormGroup).disable();
      }
    });
    
    this.issues.push(newIssue);
  }

  onCheckEligibility(issueForm: FormGroup<IssueForm>) {
    if (issueForm.pending) return;

    // TODO: Figure out why passing onlySelf: true into updateValueAndValidity still updates parent form groups
    (issueForm.get('eligibilityValidators') as FormControl).updateValueAndValidity();
    (issueForm.get('eligibility') as FormGroup<EligibilityForm>).markAllAsTouched();
    // Doesn't work because of async validation
    // if ((issueForm.get('eligibilityValidators') as FormControl).valid) {
    //   (issueForm.get('shouldShowProfileForm') as FormControl).setValue(true);
    // }
  }

  onEditInformation(issueForm: FormGroup<IssueForm>) {
    (issueForm.get('shouldLockEligibilityForm') as FormControl).setValue(false);
  }

  // TODO: Consider instead of getters, using another state variable to show as eligible
  // Note: Eligibility formgroup should only be disabled (shouldLockEligibilityForm = true) when shouldShowAsEligible is true. 
  shouldShowAsEligible(issueForm: FormGroup<IssueForm>): boolean {
    // let showEligible = (issueForm.get('isEligibilityChecked') as FormControl)?.value &&
    //   (issueForm.get('eligibilityValidators') as FormControl)?.valid;
    // let showEligible = (issueForm.get('eligibility') as FormGroup)?.disabled
    let showEligible = (issueForm.get('shouldLockEligibilityForm') as FormControl).value
    // console.log('showEligible', showEligible);
    // console.log(issueForm);
    return showEligible;
  }

  //TODO: Consider instead of getters, using another state variable stored as a formcontrol to consolidate all state variables
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
    console.log('Marked form as touched:', form.status);

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
