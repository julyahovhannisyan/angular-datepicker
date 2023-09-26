import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DatePickerTriggerService } from '../../datetimepicker.service';

import { ComponentList, DatePickerData } from '../../models';

@Component({
  selector: 'cm-dayPicker',
  templateUrl: './daypicker.component.html',
})
export class DayPickerComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;
  @Input() rangePosition: string;

  monthDays: Array<any> = [];

  selectedStarttDate: Date;
  selectedEndDate: Date;
  selectedSingleDate: Date;

  componentList: ComponentList = new ComponentList();

  todayDate: Date;

  dpSubscription;

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    const current = moment(new Date()).format('MM/DD/yyyy HH:mm:ss');
    this.todayDate = new Date(current);

    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'dayPicker' + this.datePickerObj.instanceId
    );

    this.dpSubscription.subscribe((action) => {
      switch (action.target) {
        case 'setStartDay':
          this.removedRange();
          this.selectedStarttDate = new Date(
            this.datePickerObj.selectedDate.startDate
          );
          this.selectedEndDate = new Date(null);
          if (action.position == 'start') {
            this.datePickerObj.selectedRange = [];
            if (this.rangePosition == 'end') {
              this.removedRange();
              this.selectedRange();
            }
          }
          break;

        case 'setEndDay':
          this.selectedEndDate = new Date(
            this.datePickerObj.selectedDate.endDate
          );
          this.selectedRange();
          if (this.rangePosition == 'start') {
            if (action.position == 'end') {
              this.monthDays = [...this.monthDays];
            }
          }
          break;

        case 'updateMonth':
          this.datePickerObj.navStateDate.singleDate = new Date(action.date);
          this.generateDays(this.datePickerObj.navStateDate.singleDate);
          break;

        case 'changeStyle':
          this.monthDays.map((m) => {
            for (let j = 0; j < m.length; j++) {
              if (m[j].date) {
                if (
                  this.datePickerObj.selectedDate.startDate.getTime() <=
                    action.date.getTime() &&
                  m[j].date.getTime() <= action.date.getTime() &&
                  m[j].date.getTime() >=
                    this.datePickerObj.selectedDate.startDate.getTime()
                ) {
                  m[j].date['changeStyle'] = true;
                } else {
                  m[j].date['changeStyle'] = false;
                }
              }
            }
          });
          break;

        case 'updateDate':
          this.selectedSingleDate = new Date(action.date);
          this.datePickerObj.selectedDate.singleDate = new Date(action.date);
          this.datePickerObj.navStateDate.singleDate = new Date(action.date);
          this.datePickerTriggerService.triggerAction(
            'updateMonth',
            'single',
            '',
            this.datePickerObj.navStateDate.singleDate,
            this.datePickerObj.instanceId,
            this.componentList
          );
          break;
      }

      if (action.target == 'updateNavMonth') {
        if (this.rangePosition != 'single') {
          this.generateDays(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
          this.selectedRange();
        }
      }

      if (action.target == 'updateDay') {
        if (this.rangePosition != 'single') {
          this.generateDays(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
          this.selectedRange();
        }
      }

      if (
        action.target == 'updateRangeDay' ||
        (action.target == 'updateRange' && this.rangePosition != 'single')
      ) {
        if (action.target == 'updateRangeDay') {
          this.datePickerObj.selectedDate.startDate = new Date(action.date);
          this.datePickerObj.selectedDate.endDate = new Date(action.date);
        }
        if (action.target == 'updateRange') {
          this.datePickerObj.selectedDate.startDate = new Date(action.date);
          this.datePickerObj.selectedDate.endDate = new Date(
            moment(
              new Date(action.date).setDate(
                this.datePickerObj.selectedDate.startDate.getDate() + 6
              )
            ).format('MM/DD/yyyy')
          );
        }
        this.selectedRange();
        this.selectedStarttDate = new Date(
          this.datePickerObj.selectedDate.startDate
        );
        this.selectedEndDate = new Date(
          this.datePickerObj.selectedDate.endDate
        );

        this.datePickerObj.navStateDate.startDate = new Date(
          this.datePickerObj.selectedDate.startDate
        );
        this.datePickerObj.navStateDate.endDate = new Date(
          this.datePickerObj.selectedDate.endDate
        );
        this.datePickerTriggerService.triggerAction(
          'updateNavMonth',
          'start',
          '',
          this.datePickerObj.navStateDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
        this.datePickerTriggerService.triggerAction(
          'updateNavMonth',
          'end',
          '',
          this.datePickerObj.navStateDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      }
    });

    setTimeout(() => {
      this.generateDays(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
      if (this.rangePosition != 'single') {
        this.selectedStarttDate = new Date(
          this.datePickerObj.selectedDate.startDate
        );
        this.selectedEndDate = new Date(
          this.datePickerObj.selectedDate.endDate
        );
      } else {
        this.selectedSingleDate = new Date(
          this.datePickerObj.selectedDate.singleDate
        );
      }
      this.selectedRange();
    }, 1000);
  }

  changeStyle(event: Date) {
    if (event && this.datePickerObj.selectSequenceFlag == 2) {
      this.datePickerTriggerService.triggerAction(
        'changeStyle',
        this.rangePosition,
        null,
        event,
        this.datePickerObj.instanceId,
        this.componentList
      );
    }
  }

  generateDays(date: Date) {
    var day = 1;
    var dateArr = [];

    var month = date.getMonth() + 1;
    var firstDay = new Date(date.getFullYear(), date.getMonth());
    var startingDay = firstDay.getDay();
    var monthLength = this.getMonthLength(month, date.getFullYear());

    var nextDate = 1;
    var lastMonthLength = this.getMonthLength(month - 1, date.getFullYear());

    var dateRow: { day: Number; date: Date; inRange: Boolean }[] = [];

    // this loop is for is weeks (rows)
    for (var i = 0; i < 9; i++) {
      // this loop is for weekdays (cells)
      dateRow = [];
      for (var j = 0; j <= 6; j++) {
        var dateCell: number = null;
        if (day <= monthLength && (i > 0 || j >= startingDay)) {
          dateCell = day;
          day++;
        }
        if (dateCell != null) {
          dateRow.push({
            day: dateCell,
            date: new Date(
              month.toString() +
                '/' +
                dateCell.toString() +
                '/' +
                date.getFullYear()
            ),
            inRange: false,
          });
        } else if (dateCell == null && day <= 1) {
          dateRow.unshift({ day: lastMonthLength, date: null, inRange: false });
          lastMonthLength = lastMonthLength - 1;
        } else if (dateCell == null && day > 20) {
          dateRow.push({ day: nextDate, date: null, inRange: false });
          nextDate = nextDate + 1;
        }
      }
      // stop making rows if we've run out of days
      if (day > monthLength) {
        dateArr.push(dateRow);
        break;
      } else {
        dateArr.push(dateRow);
      }
    }
    this.monthDays = dateArr;
  }

  getMonthLength(month, year) {
    return new Date(year, month, 0).getDate();
  }

  selectedRange() {
    const startDate = this.datePickerObj.selectedDate.startDate || new Date();
    const endDate = this.datePickerObj.selectedDate.endDate || new Date();
    this.monthDays.map((m) => {
      for (let j = 0; j < m.length; j++) {
        if (m[j].date) {
          if (
            m[j].date.getTime() >= startDate.getTime() &&
            m[j].date.getTime() <= endDate.getTime()
          ) {
            m[j].date['inRange'] = true;
          } else {
            m[j].date['inRange'] = false;
          }
        }
      }
    });
  }

  removedRange() {
    this.monthDays.map((m) => {
      for (let j = 0; j < m.length; j++) {
        if (m[j].date) {
          m[j].date['changeStyle'] = false;
          m[j].date['inRange'] = false;
        }
      }
    });
  }

  setDay(day: { day: number; date: Date }) {
    if (day.date == null) {
      return;
    }

    if (this.datePickerObj.dateSettings['maxDate']) {
      const maxDateYear =
        this.datePickerObj.dateSettings['maxDate'].getFullYear();
      const maxDateMonth =
        this.datePickerObj.dateSettings['maxDate'].getMonth();
      const maxDateDay = this.datePickerObj.dateSettings['maxDate'].getDate();
      const navStateYear =
        this.datePickerObj.navStateDate[
          this.rangePosition + 'Date'
        ].getFullYear();
      const navStateMonth =
        this.datePickerObj.navStateDate[this.rangePosition + 'Date'].getMonth();

      if (maxDateYear < navStateYear) {
        return;
      } else if (maxDateYear == navStateYear) {
        if (navStateMonth > maxDateMonth) {
          return;
        } else if (navStateMonth == maxDateMonth) {
          if (day.day > maxDateDay) {
            return;
          }
        }
      }
    }

    if (this.rangePosition != 'single') {
      this.datePickerObj.selectSequenceFlag =
        3 - this.datePickerObj.selectSequenceFlag;
      if (this.datePickerObj.selectSequenceFlag == 2) {
        this.datePickerObj.selectedDate.startDate = new Date(day.date);
        this.datePickerObj.selectedDate.endDate = new Date(day.date);
        this.datePickerObj.selectedRange = [];
        day.date['inRange'] = true;
        this.datePickerTriggerService.triggerAction(
          'setStartDay',
          this.rangePosition,
          '',
          this.datePickerObj.selectedDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      }

      if (this.datePickerObj.selectSequenceFlag == 1) {
        if (
          this.datePickerObj.selectedDate.startDate.getTime() >
          day.date.getTime()
        ) {
          this.datePickerObj.selectSequenceFlag = 2;
          this.datePickerObj.selectedDate.startDate = new Date(day.date);
          this.datePickerObj.selectedDate.endDate = new Date(day.date);
          this.selectedRange();
          this.datePickerObj.selectedRange = [];
          day.date['inRange'] = true;
          this.datePickerTriggerService.triggerAction(
            'setStartDay',
            this.rangePosition,
            '',
            this.datePickerObj.selectedDate,
            this.datePickerObj.instanceId,
            this.componentList
          );
        } else {
          this.datePickerObj.selectedDate.endDate = new Date(day.date);
          this.datePickerTriggerService.triggerAction(
            'setEndDay',
            this.rangePosition,
            '',
            this.datePickerObj.selectedDate,
            this.datePickerObj.instanceId,
            this.componentList
          );
        }
      }
    } else {
      var selectedDateTime = new Date(day.date);
      selectedDateTime.setHours(
        this.datePickerObj.selectedDate.singleDate.getHours()
      );
      selectedDateTime.setMinutes(
        this.datePickerObj.selectedDate.singleDate.getMinutes()
      );
      selectedDateTime.setSeconds(
        this.datePickerObj.selectedDate.singleDate.getSeconds()
      );
      this.datePickerObj.selectedDate.singleDate = new Date(selectedDateTime);
      this.selectedSingleDate = new Date(
        this.datePickerObj.selectedDate.singleDate
      );
      this.datePickerTriggerService.triggerAction(
        'setDay',
        'single',
        '',
        this.datePickerObj.selectedDate.singleDate,
        this.datePickerObj.instanceId,
        this.componentList
      );
    }
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
