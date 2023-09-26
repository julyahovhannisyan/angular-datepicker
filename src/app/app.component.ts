import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'datePicker';
  settings = {
    bigBanner: false,
    timePicker: false,
    format: 'MM/dd/yyyy',
    defaultOpen: false,
    closeOnSelect: true,
    rangepicker: true,
    setDefaultValue: false,
    defaultStartYear: null,
    minYear: 0,
    maxYear: 0,
    minDate: null,
    maxDate: null
}

public date: object[] = [{key: null}];

constructor() {}

onDateSelect(date: any, index: number) {}
}
