import { CdkStep } from '@angular/cdk/stepper';
import { Component, ContentChild, ViewChild, inject } from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-custom-wizard-step',
  standalone: true,
  imports: [],
  providers: [{ provide: CdkStep, useExisting: CustomWizardStepComponent }],
  templateUrl: './custom-wizard-step.component.html',
  styleUrl: './custom-wizard-step.component.css'
})
export class CustomWizardStepComponent extends CdkStep {
  @ContentChild('stepForm') stepForm: ProfileComponent | undefined;
  override stepControl!: AbstractControl;

  ngAfterContentInit() {
    console.log('stepForm', this.stepForm)
    if (this.stepForm?.form) this.stepControl = this.stepForm?.form;
  }
}
