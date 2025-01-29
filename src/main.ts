import {AppComponent} from "./app/app.component";
import {bootstrapApplication} from "@angular/platform-browser";
import {appConfig} from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch(err =>
  //default angular error handling
  // eslint-disable-next-line no-console
  console.error(err),
)
