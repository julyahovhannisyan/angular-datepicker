import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePickerTriggerService } from '../../../datetimepicker.service';
import { ComponentList, DatePickerData } from '../../../models';

@Component({
  selector: 'cm-monthCal',
  templateUrl: './monthcal.component.html',
})
export class MonthCalComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;

  @Input() rangePosition: string;

  componentList: ComponentList = new ComponentList();

  cal_months_labels_short = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];

  dpSubscription;
  selectedDate: Date;

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'monthCal' + this.datePickerObj.instanceId
    );
    this.dpSubscription.subscribe((action) => {
      switch (action.target) {
        case 'updateMonth':
          this.selectedDate = new Date(
            this.datePickerObj.selectedDate[this.rangePosition + 'Date']
          );
          break;
      }
      if (action.target == 'updateNavMonth') {
        if (
          action.position != this.rangePosition &&
          this.rangePosition != 'single'
        ) {
          this.selectedDate = new Date(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
        }
        if (action.position == this.rangePosition) {
          this.selectedDate = new Date(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
        }
        this.datePickerTriggerService.triggerAction(
          'updateDay',
          this.rangePosition,
          '',
          this.datePickerObj.navStateDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      }
    });

    setTimeout(() => {
      this.selectedDate = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
    }, 100);
  }

  setMonth(evt: any) {
    if (evt.target.getAttribute('id')) {
      var selectedMonth = this.cal_months_labels_short.indexOf(
        evt.target.getAttribute('id')
      );
      if (this.datePickerObj.dateSettings['maxDate']) {
        const maxDateYear =
          this.datePickerObj.dateSettings['maxDate'].getFullYear();
        const maxDateMonth =
          this.datePickerObj.dateSettings['maxDate'].getMonth();
        const navStateYear =
          this.datePickerObj.navStateDate[
            this.rangePosition + 'Date'
          ].getFullYear();
        if (maxDateYear == navStateYear && selectedMonth > maxDateMonth) {
          return;
        }
      }
      this.datePickerObj.navStateDate[this.rangePosition + 'Date'].setMonth(
        selectedMonth
      );
      this.selectedDate = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
      this.datePickerObj.navStateDate[this.rangePosition + 'Date'] = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );

      if (this.rangePosition != 'single') {
        this.datePickerTriggerService.triggerAction(
          'updateNavMonth',
          this.rangePosition,
          'monthCal',
          this.datePickerObj.navStateDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      } else {
        this.datePickerObj.selectedDate.singleDate = new Date(
          this.datePickerObj.navStateDate.singleDate
        );
        this.datePickerTriggerService.triggerAction(
          'updateMonth',
          'single',
          'monthCal',
          this.datePickerObj.selectedDate.singleDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      }
    }
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
