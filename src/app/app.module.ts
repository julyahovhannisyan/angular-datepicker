import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DatePickerModule } from './components/datetimepicker/datepicker.module';
import { DatePickerTriggerService } from './components/datetimepicker/datetimepicker.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, DatePickerModule],
  providers: [DatePickerTriggerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
