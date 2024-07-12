import { Injectable } from '@angular/core';
import {
  ValidationErrors,
  FormControl,
  AbstractControl,
  AsyncValidator,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, catchError, delay, map, of } from 'rxjs';

export function issueTypeValidator(
  control: AbstractControl
): ValidationErrors | null {
  // if (!control.parent) {
  //   return null;
  // }
  // const issueTypeValue = (control.parent.get('issueType') as FormControl).value;
  const issueTypeValue = (control.get('issueType') as FormControl).value;
  return issueTypeValue && issueTypeValue.length < 5
    ? { issueType: `${issueTypeValue} is not a valid issue type.` }
    : null;
}

export function issueEligibilityValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  // if (!control.parent) {
  //   return of(null);
  // }
  // const issueTypeValue = (control.parent.get('issueType') as FormControl).value;
  const issueTypeValue = (control.get('issueType') as FormControl).value;
  return of(issueTypeValue).pipe(
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

export function allRequiredFieldsFilled(
  control: AbstractControl
): ValidationErrors | null {
  const controlValue = control.value;
  let isValid;
  if (controlValue) {
    isValid =
      controlValue.first &&
      controlValue.last &&
      controlValue.gender &&
      (controlValue.gender !== 'Other' || controlValue.genderOther);
  }
  return isValid ? null : { allRequired: true };
}
