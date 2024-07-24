import {
  ValidationErrors,
  FormControl,
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
  FormGroup,
} from '@angular/forms';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { EligibilityForm } from './long-form-2.component';

// Note: Parameter type must be of type AbstractControl as this function will be called with this type
// and cannot automatically downcast to a subtype - will show error when calling fb.group(). 
export function requiredEligibilityFieldsValidator(
  control: AbstractControl
): ValidationErrors | null {
  const parentForm = control.parent as FormGroup<EligibilityForm>;
  if (!parentForm) {
    return of(null);
  }
  
  const issueType = (parentForm.get('issueType') as FormControl<string>).value;
  const isEligible = (parentForm.get('isEligible') as FormControl<boolean | null>).value; 

  return !issueType || isEligible === null
    ? { requiredFields: `Fill in all required fields.` }
    : null;
}

export function issueTypeValidator(
  control: AbstractControl
): ValidationErrors | null {
  const parentForm = control.parent as FormGroup<EligibilityForm>;
  if (!parentForm) {
    return of(null);
  }

  const issueType = (parentForm.get('issueType') as FormControl<string>).value;
  // const issueTypeValue = (control.get('issueType') as FormControl).value;
  return issueType && issueType.length < 5
    ? { issueType: `${issueType} is not a valid issue type.` }
    : null;
}

export function issueEligibilityValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  const parentForm = control.parent as FormGroup<EligibilityForm>;
  if (!parentForm) {
    return of(null);
  }

  const issueType = (parentForm.get('issueType') as FormControl<string>).value;
  // const issueTypeValue = (control.get('issueType') as FormControl).value;
  return of(issueType).pipe(
    delay(1000),
    map((issueTypeValue) =>
      issueTypeValue !== 'Request for Records'
        ? {
            issueEligibility: `This issue of type ${issueTypeValue} is not eligible.`,
          }
        : null
    ),
    catchError(() => of(null))
  );
}

export function eligibilityValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  const parentForm = control.parent as FormGroup<EligibilityForm>;
  if (!parentForm) {
    return of(null);
  }

  const isEligible = (parentForm.get('isEligible') as FormControl<boolean | null>).value;
  return of(isEligible).pipe(
    delay(1000),
    map((isEligible) =>
      !isEligible
        ? {
            issueEligibility: `This issue is not eligible.`,
          }
        : null
    ),
    catchError(() => of(null))
  );
}