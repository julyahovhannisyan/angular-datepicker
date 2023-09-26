
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatePicker } from './datepicker.component';
import { MonthCalComponent } from './calendar/monthPicker/monthcal/monthcal.component';
import { MonthNavComponent } from './calendar/monthPicker/monthnav/monthnav.component'
import { YearPickerComponent } from './calendar/yearPicker/yearpicker/yearPicker.component';
import { YearListComponent } from './calendar/yearPicker/yearslist/yearList.component';
// import { DayPickerComponent } from './calendar/dayPicker/dayPicker.component';
import { DayPickerComponent } from './calendar/daypicker/daypicker.component';

import { CalendarComponent } from './calendar/calendar.component';
import { ClickOutsideDirective } from './directives/clickOutside';
@NgModule({
  declarations: [
    DatePicker, CalendarComponent, YearPickerComponent, YearListComponent, MonthNavComponent, DayPickerComponent, MonthCalComponent, ClickOutsideDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [ DatePicker, YearPickerComponent, YearListComponent, MonthNavComponent, DayPickerComponent, MonthCalComponent, ClickOutsideDirective]
})
export class DatePickerModule {
}
