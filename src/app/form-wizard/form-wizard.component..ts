import { Component, DoCheck, OnInit } from '@angular/core';
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

@Component({
  selector: 'form-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TextFieldCvaComponent,
    ProfileComponent,
  ],
  templateUrl: './form-wizard.component.html',
})
export class FormWizardComponent implements OnInit, DoCheck {
  form = this.fb.group({
    issues: this.fb.group({}),
    parties: this.fb.group({}),
  });
  lifecycleTicks: number = 0;

  constructor(public fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.form);
    
  }

  ngDoCheck() {
    console.log(++this.lifecycleTicks);
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
