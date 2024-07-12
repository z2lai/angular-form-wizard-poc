import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES, App } from './app/app.component';

bootstrapApplication(App, {providers: [provideRouter(APP_ROUTES, withComponentInputBinding())]});
