import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-text-field-cva',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-field-cva.component.html',
  styleUrls: ['./text-field-cva.component.scss'],
  // providers: [
  //   {
  //     provide: NG_VALUE_ACCESSOR,
  //     useExisting: RequiredFieldComponent,
  //     multi: true,
  //   },
  // ],
})
export class TextFieldCvaComponent implements OnInit, ControlValueAccessor {
  @Output() blur: EventEmitter<void> = new EventEmitter<void>();
  value = '';
  label = '';
  disabled!: boolean;
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Self() public controlDirective: NgControl) {
    controlDirective.valueAccessor = this;
  }

  get control() {
    return this.controlDirective.control;
  }

  ngOnInit(): void {
    const control = this.controlDirective.control;
    // Set required validator
    // const validators = control?.validator
    //   ? [control.validator, Validators.required]
    //   : Validators.required;
    // control?.setValidators(validators);
    // control?.updateValueAndValidity();
    this.label = this.controlDirective.path!.join('-');
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(onChange: (value: any) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
