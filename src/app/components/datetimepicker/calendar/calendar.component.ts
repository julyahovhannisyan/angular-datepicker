import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePickerTriggerService } from '../datetimepicker.service';
import { ComponentList, DatePickerData } from '../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'cm-calendar',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, OnDestroy {
  @Input() datePickerObj: DatePickerData;
  @Input() rangePosition: string = '';

  dpSubscription: Subject<{
    target: string;
    position: string;
    componentName: string;
    date: any;
    groupId: number;
    compName: ComponentList;
  }>;

  yearsList: boolean = false;
  daysList: boolean = true;
  monthsList: boolean = false;

  componentList: ComponentList = new ComponentList();

  constructor(private datePickerTriggerService: DatePickerTriggerService) {}

  ngOnInit() {
    this.dpSubscription = this.datePickerTriggerService.getTriggerListener(
      'calendar' + this.datePickerObj?.instanceId
    );
    this.dpSubscription.subscribe(
      (action: { target: any; position: string; componentName: string }) => {
        switch (action.target) {
          case 'updateNavMonth':
            if (
              this.rangePosition == action.position &&
              action.componentName == 'yearList'
            ) {
              this.yearsList = false;
              this.daysList = true;
            }
            if (
              this.rangePosition == action.position &&
              action.componentName == 'monthCal'
            ) {
              this.monthsList = false;
              this.daysList = true;
            }
            break;

          case 'updateMonth':
            if (action.componentName == 'yearList') {
              this.yearsList = false;
              this.daysList = true;
            }
            if (action.componentName == 'monthCal') {
              this.monthsList = false;
              this.daysList = true;
            }
            break;
        }
      }
    );
  }

  showList(event: any, component: string) {
    if (component == 'month') {
      this.monthsList = event;
      if (this.monthsList) {
        this.yearsList = false;
        this.daysList = false;
      } else {
        this.daysList = true;
        this.yearsList = false;
        this.monthsList = false;
      }
      this.componentList.monthList = this.monthsList;
      this.componentList.yearList = this.yearsList;
      this.datePickerTriggerService.triggerAction(
        'updateComponent',
        '',
        '',
        '',
        this.datePickerObj.instanceId,
        this.componentList
      );
    } else if (component == 'year') {
      this.yearsList = event;
      if (this.yearsList) {
        this.monthsList = false;
        this.daysList = false;
      } else {
        this.daysList = true;
        this.yearsList = false;
        this.monthsList = false;
      }
      this.componentList.monthList = this.monthsList;
      this.componentList.yearList = this.yearsList;
      this.datePickerTriggerService.triggerAction(
        'updateComponent',
        '',
        '',
        '',
        this.datePickerObj.instanceId,
        this.componentList
      );
    }
  }

  ngOnDestroy() {
    this.dpSubscription.unsubscribe();
  }
}
