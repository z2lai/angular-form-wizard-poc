import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
} from '@angular/forms';
import { VeganMenuValidator } from '../validators';

export type BurgerBuild = {
  bun: 'Pretzel' | 'Ciabatta';
  cheese: 'Blue cheese' | 'Swiss Cheese' | 'Tofu' | 'Nothing';
  meat: 'Soy meat' | 'Chicken' | 'Beef';
  extras: 'Spice pepper' | 'Fig jam' | 'Nothing';
  isVegan: boolean;
};

export type Bun = BurgerBuild['bun'];
export type Cheese = BurgerBuild['cheese'];
export type Meat = BurgerBuild['meat'];
export type Extras = BurgerBuild['extras'];

@Component({
  selector: 'burger-builder',
  standalone: true,
  templateUrl: 'burger-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: 'burger-builder.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BurgerBuilderComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BurgerBuilderComponent),
      multi: true,
    },
  ],
  imports: [FormsModule],
})
export class BurgerBuilderComponent implements ControlValueAccessor {
  onChange: any;
  onTouched: any;

  burgerSettings = signal<BurgerBuild>({
    bun: 'Ciabatta',
    cheese: 'Nothing',
    meat: 'Beef',
    extras: 'Nothing',
    isVegan: false,
  });
  disabled = signal(false);

  buns: Bun[] = ['Ciabatta', 'Pretzel'];
  cheeses: Cheese[] = ['Blue cheese', 'Swiss Cheese', 'Tofu', 'Nothing'];
  meats: Meat[] = ['Soy meat', 'Chicken', 'Beef'];
  extras: Extras[] = ['Spice pepper', 'Fig jam', 'Nothing'];

  selectBun(selectedBun: Bun) {
    this.burgerSettings.update((burger) => {
      return { ...burger, bun: selectedBun };
    });
    this.onChange(this.burgerSettings());
  }

  selectCheese(selectedCheese: Cheese) {
    this.burgerSettings.update((burger) => {
      return { ...burger, cheese: selectedCheese };
    });
    this.onChange(this.burgerSettings());
  }

  selectMeat(selectedMeat: Meat) {
    this.burgerSettings.update((burger) => {
      return { ...burger, meat: selectedMeat };
    });
    this.onChange(this.burgerSettings());
  }

  selectExtras(selectedExtras: Extras) {
    this.burgerSettings.update((burger) => {
      return { ...burger, extras: selectedExtras };
    });
    this.onChange(this.burgerSettings());
  }

  isVeganOptionChanged(state: boolean) {
    this.burgerSettings.update((burger) => {
      return { ...burger, isVegan: state };
    });
    this.onChange(this.burgerSettings());
  }

  writeValue(obj: BurgerBuild): void {
    this.burgerSettings.set(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // source code for curious people
  // https://github.com/angular/angular/blob/d2c83ea81b60366d1ef23e0b1c8c4abff0354a0e/packages/forms/src/model.ts#L602
  validate(control: FormControl<BurgerBuild>): ValidationErrors | null {
    return VeganMenuValidator(control);
  }
}
