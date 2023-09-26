import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePickerTriggerService } from '../../../datetimepicker.service';
import { ComponentList, DatePickerData } from '../../../models';

@Component({
  selector: 'cm-yearList',
  templateUrl: './yearlist.component.html',
})
export class YearListComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;
  @Input() rangePosition: string;

  yearsList: Array<any> = [];

  startYear = null;
  selectedDate: Date;
  nextBtn: boolean = true;
  prevBtn: boolean = true;

  currentYear;
  dpSubscription;

  componentList: ComponentList = new ComponentList();

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'dayPicker' + this.datePickerObj.instanceId
    );
    this.dpSubscription.subscribe((action) => {
      if (action.target == 'updateNavMonth') {
        if (
          action.position != this.rangePosition &&
          this.rangePosition != 'single'
        ) {
          if (
            this.datePickerObj.navStateDate.startDate.getFullYear() >=
              this.datePickerObj.navStateDate.endDate.getFullYear() &&
            this.datePickerObj.navStateDate.startDate.getMonth() >=
              this.datePickerObj.navStateDate.endDate.getMonth()
          ) {
            if (this.rangePosition == 'start') {
              this.datePickerObj.navStateDate.startDate = new Date(
                new Date(this.datePickerObj.navStateDate.endDate).setMonth(
                  this.datePickerObj.navStateDate.endDate.getMonth() - 1
                )
              );
            }
            if (this.rangePosition == 'end') {
              this.datePickerObj.navStateDate.endDate = new Date(
                new Date(this.datePickerObj.navStateDate.startDate).setMonth(
                  this.datePickerObj.navStateDate.startDate.getMonth() + 1
                )
              );
            }
          }
          this.selectedDate = new Date(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
        }

        if (action.position == this.rangePosition) {
          this.selectedDate = new Date(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
        }
      }

      if (action.target == 'updateMonth') {
        if (action.position == 'single') {
          this.selectedDate = new Date(action.date);
        }
      }
    });
    setTimeout(() => {
      if (this.datePickerObj.dateSettings['maxYear']) {
        this.selectedDate = new Date(
          +this.datePickerObj.dateSettings['maxYear']
        );
        this.currentYear = this.datePickerObj.dateSettings['maxYear'];
      } else {
        this.selectedDate = new Date(
          this.datePickerObj.navStateDate[this.rangePosition + 'Date']
        );
        this.currentYear =
          this.datePickerObj.navStateDate[
            this.rangePosition + 'Date'
          ].getFullYear();
      }
      this.startYear = this.currentYear - 4;
      this.generateYearsList();
    }, 1000);
  }

  setYear(selectedYear: number) {
    if (
      this.datePickerObj.dateSettings['maxYear'] &&
      this.datePickerObj.dateSettings['maxYear'] < selectedYear
    ) {
      return;
    } else if (
      this.datePickerObj.dateSettings['minYear'] &&
      this.datePickerObj.dateSettings['minYear'] > selectedYear
    ) {
      return;
    } else {
      this.datePickerObj.navStateDate[this.rangePosition + 'Date'].setFullYear(
        selectedYear
      );
      this.selectedDate = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
      if (this.rangePosition != 'single') {
        this.datePickerTriggerService.triggerAction(
          'updateNavMonth',
          this.rangePosition,
          'yearList',
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
          'yearList',
          this.datePickerObj.selectedDate.singleDate,
          this.datePickerObj.instanceId,
          this.componentList
        );
      }
    }
  }

  generateYearsList() {
    this.prevBtn = true;
    this.nextBtn = true;

    this.yearsList = [];

    for (let i = this.currentYear - 4; i < this.currentYear; i++) {
      this.yearsList.push(i);
    }
    for (let i = this.currentYear; i < this.currentYear + 5; i++) {
      this.yearsList.push(i);
    }

    if (this.yearsList.includes(this.datePickerObj.dateSettings['maxYear'])) {
      this.nextBtn = false;
    }
    if (this.yearsList.includes(this.datePickerObj.dateSettings['minYear'])) {
      this.prevBtn = false;
    }
  }

  generateYear(param: string) {
    if (param == 'next') {
      if (!this.nextBtn) {
        return;
      } else {
        if (
          this.currentYear >= this.datePickerObj.dateSettings['maxYear'] &&
          this.datePickerObj.dateSettings['maxYear'] > 0
        ) {
          return;
        } else {
          this.currentYear = this.currentYear + 9;
        }
      }
    } else {
      if (this.prevBtn) {
        this.currentYear = this.currentYear - 9;
      }
    }
    this.generateYearsList();
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
