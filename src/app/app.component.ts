import { Component } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { LongForm1Component } from "./long-form-1/long-form-1.component";
import { LongForm2Component } from "./long-form-2/long-form-2.component";
import { FormWizardComponent } from "./form-wizard/form-wizard.component.";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `
      <div class="container">
        <h1>Angular 18 Form Wizard (Multi-Item/Multi-Step) - Long-form Approach</h1>
        <nav>
          <a routerLink="/long-form-1" routerLinkActive="text-dark fw-bold">Long Form 1</a>
          <br />
          <a routerLink="/long-form-2" routerLinkActive="text-dark fw-bold">Long Form 2</a>
          <br />
          <a routerLink="/form-wizard" routerLinkActive="text-dark fw-bold">Form Wizard</a>
        </nav>
        <hr />
        <router-outlet />
      </div>
    `,
  })
  export class App { }
  
  // Note that URL does not update in Preview mode, open Preview in New tab to see URL updates
  export const APP_ROUTES: Route[] = [
    {
      path: 'long-form-1',
      component: LongForm1Component,
    },
    {
      path: 'long-form-2',
      component: LongForm2Component,
    },
    {
      path: 'form-wizard',
      component: FormWizardComponent,
    },
    {
      path: '',
      redirectTo: '/long-form-1',
      pathMatch: 'full',
    },
  ];