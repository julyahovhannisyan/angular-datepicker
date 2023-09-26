import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DatePickerTriggerService } from '../../../datetimepicker.service';
import { DatePickerData } from '../../../models';

@Component({
  selector: 'cm-yearPicker',
  templateUrl: './yearpicker.component.html',
})
export class YearPickerComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;
  @Input() rangePosition: string;

  yearsList: boolean = false;
  selectedDate: Date;
  dpSubscription;

  @Output() showList: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'dayPicker' + this.datePickerObj.instanceId
    );
    this.dpSubscription.subscribe((action) => {
      if (action.target == 'updateNavMonth') {
        if (action.componentName == 'yearList') {
          this.yearsList = false;
        }
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
            this.selectedDate = new Date(
              this.datePickerObj.navStateDate[this.rangePosition + 'Date']
            );
          }
        }

        if (action.position == this.rangePosition) {
          this.selectedDate = new Date(
            this.datePickerObj.navStateDate[this.rangePosition + 'Date']
          );
        }
      }

      if (action.target == 'updateMonth') {
        if (action.position == 'single') {
          if (action.componentName == 'yearList') {
            this.yearsList = false;
          }
          this.selectedDate = new Date(action.date);
        }
      }

      if (action.target == 'updateComponent') {
        if (action.compName.monthList == true) {
          this.yearsList = false;
        }
      }
    });

    setTimeout(() => {
      this.selectedDate = new Date(
        this.datePickerObj.navStateDate[this.rangePosition + 'Date']
      );
    }, 1000);
  }

  openYearsList() {
    this.yearsList = this.yearsList ? false : true;
    this.showList.emit(this.yearsList);
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
