import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DatePickerTriggerService } from '../../../datetimepicker.service';
import { ComponentList, DatePickerData } from '../../../models';

@Component({
  selector: 'cm-monthNav',
  templateUrl: './monthNav.component.html',
})
export class MonthNavComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;
  @Input() rangePosition: string;

  monthsList: Boolean = false;
  selectedDate: Date;

  componentList: ComponentList = new ComponentList();

  @Output() showList: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  dpSubscription;

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'monthNav' + this.datePickerObj.instanceId
    );
    this.dpSubscription.subscribe((action) => {
      switch (action.target) {
        case 'updateNavMonth':
          if (action.componentName == 'monthCal') {
            this.monthsList = false;
          }
          if (
            action.position != this.rangePosition &&
            this.rangePosition != 'single'
          ) {
            if (
              this.datePickerObj.navStateDate.startDate.getMonth() >=
                this.datePickerObj.navStateDate.endDate.getMonth() &&
              this.datePickerObj.navStateDate.startDate.getTime() >=
                this.datePickerObj.navStateDate.endDate.getTime()
            ) {
              if (this.rangePosition == 'start') {
                this.datePickerObj.navStateDate.startDate.setMonth(
                  this.datePickerObj.navStateDate.endDate.getMonth() - 1
                );
              }
              if (this.rangePosition == 'end') {
                this.datePickerObj.navStateDate.endDate.setMonth(
                  this.datePickerObj.navStateDate.startDate.getMonth() + 1
                );
              }

              this.datePickerObj.navStateDate[this.rangePosition + 'Date'] =
                new Date(
                  this.datePickerObj.navStateDate[this.rangePosition + 'Date']
                );
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
          this.datePickerTriggerService.triggerAction(
            'updateDay',
            this.rangePosition,
            '',
            this.datePickerObj.navStateDate,
            this.datePickerObj.instanceId,
            this.componentList
          );
          break;
      }
      if (action.target == 'updateMonth' && this.rangePosition == 'single') {
        if (action.componentName == 'monthCal') {
          this.monthsList = false;
        }
        this.selectedDate = new Date(action.date);
      }
      if (action.target == 'updateComponent') {
        if (action.compName.yearList == true) {
          this.monthsList = false;
        }
      }
    });

    setTimeout(() => {
      this.selectedDate = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
    }, 100);
  }

  openMonthsList() {
    this.monthsList = this.monthsList ? false : true;
    this.showList.emit(this.monthsList);
  }

  navMonth(direction: string) {
    const navStateYear =
      this.datePickerObj.navStateDate[
        this.rangePosition + 'Date'
      ].getFullYear();
    const navStateMonth =
      this.datePickerObj.navStateDate[this.rangePosition + 'Date'].getMonth();

    if (direction == 'prev') {
      if (
        (this.datePickerObj.dateSettings['minYear'] &&
          this.datePickerObj.dateSettings['minYear'] >
            this.datePickerObj.navStateDate.singleDate.getFullYear()) ||
        (this.datePickerObj.dateSettings['minYear'] == navStateYear &&
          navStateMonth == 0)
      ) {
        return;
      }

      this.datePickerObj.navStateDate[this.rangePosition + 'Date'].setMonth(
        this.datePickerObj.navStateDate[
          this.rangePosition + 'Date'
        ].getMonth() - 1
      );
    }
    if (direction == 'next') {
      if (
        (this.datePickerObj.dateSettings['maxYear'] &&
          this.datePickerObj.dateSettings['maxYear'] <
            this.datePickerObj.navStateDate.singleDate.getFullYear()) ||
        (this.datePickerObj.dateSettings['maxYear'] == navStateYear &&
          navStateMonth == 11)
      ) {
        return;
      }
      if (this.datePickerObj.dateSettings['maxDate']) {
        const maxDateYear =
          this.datePickerObj.dateSettings['maxDate'].getFullYear();
        const maxDateMonth =
          this.datePickerObj.dateSettings['maxDate'].getMonth();
        if (maxDateYear == navStateYear && navStateMonth >= maxDateMonth) {
          return;
        }
      }
      this.datePickerObj.navStateDate[this.rangePosition + 'Date'].setMonth(
        this.datePickerObj.navStateDate[
          this.rangePosition + 'Date'
        ].getMonth() + 1
      );
    }
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
        '',
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
