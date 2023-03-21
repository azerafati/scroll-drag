import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxScrollDragModule } from "ngx-scroll-drag";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxScrollDragModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
