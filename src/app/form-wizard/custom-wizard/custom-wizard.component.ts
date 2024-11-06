import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-custom-wizard',
  standalone: true,
  imports: [   
    CommonModule,
    NgTemplateOutlet, 
    CdkStepperModule
  ],
  providers: [
    { 
      provide: CdkStepper,
      useExisting: CustomWizardComponent
    }
  ],
  templateUrl: './custom-wizard.component.html',
  styleUrl: './custom-wizard.component.css'
})
export class CustomWizardComponent extends CdkStepper {
  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
