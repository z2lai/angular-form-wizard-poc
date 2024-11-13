import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomWizardStepComponent } from './custom-wizard-step.component';

describe('CustomWizardStepComponent', () => {
  let component: CustomWizardStepComponent;
  let fixture: ComponentFixture<CustomWizardStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomWizardStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomWizardStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
