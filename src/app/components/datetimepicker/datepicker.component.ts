import {
  Component,
  OnInit,
  forwardRef,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DatePickerData, ComponentList } from './models';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePickerTriggerService } from './datetimepicker.service';

import * as moment from 'moment';
import { Settings } from './interface';

export const DATEPICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePicker),
  multi: true,
};

@Component({
  selector: 'angular-date-picker',
  templateUrl: './datepicker.component.html',
  providers: [DATEPICKER_CONTROL_VALUE_ACCESSOR],
})
export class DatePicker implements OnInit, OnDestroy {
  @Input()
  settings: Settings;

  @Input()
  disabled: boolean = false;

  @Output()
  onDateSelect: EventEmitter<String> = new EventEmitter<String>();

  @Output()
  onRangeSelect: EventEmitter<{ startDate: Date; endDate: Date }> =
    new EventEmitter<{ startDate: Date; endDate: Date }>();

  dpSubscription;

  dateValue: Date;

  selectedRangeDate = '';
  selectedDate: Date;
  popover: Boolean = false;
  selectedRange: boolean = false;
  datePickerObj: DatePickerData = new DatePickerData();
  componentList: ComponentList = new ComponentList();

  cal_days_in_month: Array<any> = [
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];

  defaultSettings: Settings = {
    defaultOpen: false,
    bigBanner: true,
    format: 'dd/MMM/yyyy',
    closeOnSelect: true,
    rangepicker: false,
    setDefaultValue: false,
    defaultStartYear: null,
    minYear: 2010,
    maxYear: 2030,
    minDate: null,
    maxDate: null,
  };

  private calendar_box: ElementRef;
  public distance_from_border: number;

  @ViewChild('calendar_box', { static: false }) set content(
    content: ElementRef
  ) {
    if (content) {
      this.calendar_box = content;
    }
  }

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.datePickerObj.dateSettings = Object.assign(
      this.defaultSettings,
      this.settings
    );
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'dayPicker' + this.datePickerObj.instanceId
    );

    // Set the value to data from the server if available, or null if there's no data.
    this.writeValue(null);

    this.dpSubscription.subscribe((action) => {
      switch (action.target) {
        case 'setDay':
        case 'setEndDay':
          if (action.target == 'setDay') {
            this.dateValue = this.datePickerObj.selectedDate.singleDate;
          }
          if (this.settings['closeOnSelect']) {
            if (!this.settings['rangepicker']) {
              this.onDateSelect.emit(
                this.datePickerObj.selectedDate.singleDate.toString()
              );
            } else {
              this.onRangeSelect.emit({
                startDate: this.datePickerObj.selectedDate.startDate,
                endDate: this.datePickerObj.selectedDate.endDate,
              });
            }
            this.closepopover();
          }
          break;
      }
    });
  }

  togglePopoverClick() {
    if (this.disabled) {
      return;
    }
    this.popover = !this.popover;

    let domRect = this.calendar_box.nativeElement.getBoundingClientRect();
    this.distance_from_border = window.innerHeight - domRect.bottom;
  }

  writeValue(value: any) {
    if (value !== undefined && value !== null) {
      if (!this.settings['rangepicker']) {
        this.initDate(value);
      } else {
        this.initDateRange(value);
      }
    } else {
      this.datePickerObj.selectedDate.singleDate = new Date();
      this.datePickerObj.navStateDate.singleDate = new Date();
      if (this.datePickerObj.dateSettings['defaultStartYear']) {
        this.datePickerObj.navStateDate.singleDate = new Date(
          this.datePickerObj.dateSettings['defaultStartYear']
        );
      }
      if (
        this.datePickerObj.dateSettings['maxYear'] &&
        this.datePickerObj.dateSettings['maxYear'] < new Date().getFullYear()
      ) {
        this.datePickerObj.selectedDate.singleDate = new Date(
          this.datePickerObj.selectedDate.singleDate.setFullYear(
            this.datePickerObj.dateSettings['maxYear']
          )
        );
        this.datePickerObj.navStateDate.singleDate = new Date(
          this.datePickerObj.navStateDate.singleDate.setFullYear(
            this.datePickerObj.dateSettings['maxYear']
          )
        );
      }

      this.datePickerObj.selectedDate.startDate = new Date();
      this.datePickerObj.selectedDate.endDate = new Date();
      this.datePickerObj.navStateDate.startDate = new Date(
        new Date().setDate(1)
      );
      this.datePickerObj.navStateDate.endDate = new Date(
        new Date(new Date().setMonth(new Date().getMonth() + 1)).setDate(1)
      );
    }
  }

  initDate(val: Date | string) {
    const date = moment(val).format('MM/DD/yyyy HH:mm:ss');
    this.datePickerObj.selectedDate.singleDate =
      val != 'Invalid Date' ? new Date(date) : new Date();
    this.dateValue = this.datePickerObj.selectedDate.singleDate;
    this.datePickerObj.navStateDate.singleDate = new Date(
      new Date(this.datePickerObj.selectedDate.singleDate).setDate(1)
    );
    if (val == 'Invalid Date') {
      this.dateValue = this.dateValue = null;
    }
  }

  initDateRange(val: any) {
    const startDate = moment(val.startDate).format('MM/DD/yyyy');
    const endDate = moment(val.endDate).format('MM/DD/yyyy');

    this.datePickerObj.selectedDate.startDate =
      val.startDate != null ? new Date(startDate) : new Date();
    this.datePickerObj.selectedDate.endDate =
      val.startDate != null ? new Date(endDate) : new Date();

    this.datePickerObj.navStateDate.startDate = new Date(
      new Date(this.datePickerObj.selectedDate.startDate).setDate(1)
    );
    this.datePickerObj.navStateDate.endDate = new Date(
      new Date(this.datePickerObj.selectedDate.endDate).setDate(1)
    );
    if (
      this.datePickerObj.selectedDate.startDate.getMonth() ==
        this.datePickerObj.selectedDate.endDate.getMonth() &&
      this.datePickerObj.selectedDate.startDate.getFullYear() ==
        this.datePickerObj.selectedDate.endDate.getFullYear()
    ) {
      this.datePickerObj.navStateDate.endDate = new Date(
        this.datePickerObj.navStateDate.endDate.setMonth(
          this.datePickerObj.navStateDate.startDate.getMonth() + 1
        )
      );
    }

    if (val.startDate == null && val.endDate == null) {
      this.datePickerObj.selectedDate.startDate = null;
      this.datePickerObj.selectedDate.endDate = null;
    }
  }

  togglePopover() {
    if (this.popover) {
      this.closepopover();
    } else {
      this.popover = true;
    }

    let domRect = this.calendar_box.nativeElement.getBoundingClientRect();
    this.distance_from_border = window.innerHeight - domRect.bottom;
  }

  setDay() {
    var currentDate = new Date(); //moment().format('D/M/yyyy');
    this.datePickerObj.selectedDate.singleDate = new Date(currentDate);
    this.datePickerTriggerService.triggerAction(
      'setDay',
      'single',
      '',
      this.datePickerObj.selectedDate.singleDate,
      this.datePickerObj.instanceId,
      this.componentList
    );
    this.datePickerTriggerService.triggerAction(
      'updateDate',
      'single',
      '',
      this.datePickerObj.selectedDate.singleDate,
      this.datePickerObj.instanceId,
      this.componentList
    );
  }

  setRangeDate(selectedDate: string) {
    this.selectedRangeDate = '';
    var currentDate = new Date(); //moment().format('D/M/yyyy');

    if (selectedDate == 'currentweek') {
      this.selectedRangeDate = moment(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay())
      ).format('MM/DD/yyyy');
    } else if (selectedDate == 'lastweek') {
      this.selectedRangeDate = moment(
        currentDate.setDate(currentDate.getDate() - currentDate.getDay() - 7)
      ).format('MM/DD/yyyy');
    } else if (selectedDate == 'nextweek') {
      this.selectedRangeDate = moment(
        currentDate.setDate(currentDate.getDate() + (7 - currentDate.getDay()))
      ).format('MM/DD/yyyy');
    }
    this.datePickerTriggerService.triggerAction(
      'updateRange',
      'start',
      '',
      this.selectedRangeDate,
      this.datePickerObj.instanceId,
      this.componentList
    );
  }

  setRangeDay(selectedDate: string) {
    this.selectedRangeDate = '';
    var currentDate = new Date(); //moment().format('D/M/yyyy');

    if (selectedDate == 'today') {
      this.selectedRangeDate = moment(currentDate).format('MM/DD/yyyy');
    } else if (selectedDate == 'yesterday') {
      this.selectedRangeDate = moment(
        currentDate.setDate(currentDate.getDate() - 1)
      ).format('MM/DD/yyyy');
    }
    this.datePickerTriggerService.triggerAction(
      'updateRangeDay',
      'start',
      '',
      this.selectedRangeDate,
      this.datePickerObj.instanceId,
      this.componentList
    );
  }

  done() {
    // this.popover = false;
    // if (!this.settings['rangepicker']) {
    //   this.onDateSelect.emit(
    //     this.datePickerObj.selectedDate.singleDate.toString()
    //   );
    // } else {
    //   this.onRangeSelect.emit({
    //     startDate: this.datePickerObj.selectedDate.startDate,
    //     endDate: this.datePickerObj.selectedDate.endDate,
    //   });
    // }
  }

  closepopover() {
    this.popover = false;
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
