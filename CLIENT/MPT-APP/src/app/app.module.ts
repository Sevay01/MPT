import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component'; // Adjust this if needed
import { TimerComponent } from './timer/timer.component'; // Adjust this if needed

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
