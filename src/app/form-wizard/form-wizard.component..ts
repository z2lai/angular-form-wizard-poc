import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck, OnInit, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import 'zone.js';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextFieldCvaComponent } from '../components/text-field-cva/text-field-cva.component';
import { ProfileComponent, ProfileForm } from '../components/profile/profile.component';
import { CustomWizardComponent } from './custom-wizard/custom-wizard.component';
import { CdkStep } from '@angular/cdk/stepper';

@Component({
  selector: 'form-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldCvaComponent,
    ProfileComponent,
    CustomWizardComponent,
    CdkStep
  ],
  templateUrl: './form-wizard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormWizardComponent implements OnInit, AfterViewChecked, DoCheck {
  // Query this object in all the hooks to see what the values are
  @ViewChildren(CdkStep) steps: QueryList<CdkStep> | undefined;

  private readonly _fb = inject(FormBuilder);
  private readonly _cdRef = inject(ChangeDetectorRef);
  form = this._fb.group({
    issues: this._fb.group({}),
    parties: this._fb.group({}),
    documents: this._fb.group({}),
  });
  lifecycleTicks: number = 0;
  isLinear = true;

  get issuesForm(): FormGroup {
    return this.form.get('issues') as FormGroup;
  }

  get partiesForm(): FormGroup {
    return this.form.get('parties') as FormGroup;
  }

  get documentsForm(): FormGroup {
    return this.form.get('documents') as FormGroup;
  }

  ngOnInit(): void {
    console.log('On Init!');
    console.log(this.form.getRawValue());
  }

  ngDoCheck() {
    console.log(++this.lifecycleTicks);
  }

  ngAfterContentInit() {
    console.log('Content Initiated!');
    console.log(this.form.getRawValue());
  }

  ngAfterContentChecked() {
    console.log('Content Checked!');
    console.log(this.form.getRawValue());
  }

  ngAfterViewInit() {
    console.log('View Initiated!');
    console.log(this.form.getRawValue());
    this._cdRef.detectChanges(); // this post says its acceptable for complex use cases: https://www.reddit.com/r/Angular2/comments/1fxk7qc/comment/lqr84im/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
  }

  ngAfterViewChecked() {
    console.log('View Checked!');
    console.log(this.form.getRawValue());
    this.steps?.forEach((step) => {
      console.log("step control:")
      console.log(step.stepControl); // Log each input element
    });
  }

  onSubmit(form: FormGroup): void {
    // 1. For all updateOn options, updateValueAndValidity is not called internally by any of the events unless the value in the input (view) has actually changed from the input in the model.
    //   - For updateOn: 'submit', I just need to bind [formGroup] to the root form for the submit button click to update all nested form controls with this option
    //   - https://stackoverflow.com/questions/57452687/angular-6-reactive-forms-updateon-submit-is-not-updating-value-after-submit	
    //   - Note: Listening to ngSubmit or submit event in the template is not required.
    // 2. On the other hand, changing the value programmatically using setValue DOES call updateValueAndValidity internally
    //   - BUT, setValue does not change TOUCHED or PRISTINE status (seems like these can only be changed by events in the view) - touched changed onblur, pristine changed onchange
    //   - I think Pristine/Dirty value is updated separately and has no bearing on if updateValueAndValidity is called or how it is called.
    // this.updateFormValueAndValidity(form); // async because of event emitter
    form.markAllAsTouched(); // async because of event emitter
    console.log('Marked form as touched:', form);

    if (form.valid) {
      // not triggered on the first time because emitted events to update parent form are async
      alert(JSON.stringify(form.value));
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
