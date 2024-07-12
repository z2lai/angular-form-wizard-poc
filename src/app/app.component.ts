import { Component } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { LongForm1Component } from "./long-form-1/long-form-1.component";
import { LongForm2Component } from "./long-form-2/long-form-2.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule],
    template: `
      <h1>Angular 18 Form Wizard (Multi-Item/Multi-Step) - Long-form Approach</h1>
      <nav>
        <a routerLink="/long-form-1">Long Form 1</a>
        <br />
        <a routerLink="/long-form-2">Long Form 2</a>
      </nav>
      <hr />
      <router-outlet />
    `,
  })
  export class App { }
  
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
      path: '',
      redirectTo: '/long-form-1',
      pathMatch: 'full',
    },
  ];