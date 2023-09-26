import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ComponentList } from '../datetimepicker/models';

@Injectable()
export class DatePickerTriggerService {
  actionTriggered$: {
    subscriber: string;
    subscription: Subject<{
      target: string;
      position: string;
      componentName: string;
      date: any;
      groupId: number;
      compName: ComponentList;
    }>;
  }[] = [];
  getTriggerListener(subscriber: string) {
    if (
      this.actionTriggered$.filter((x) => x.subscriber == subscriber).length ==
      0
    ) {
      this.actionTriggered$.push({
        subscriber: subscriber,
        subscription: new Subject<{
          target: string;
          position: string;
          componentName: string;
          date: any;
          groupId: number;
          compName: ComponentList;
        }>(),
      });
    }

    return this.actionTriggered$.filter((x) => x.subscriber == subscriber)[0]
      .subscription;
  }

  triggerAction(
    target: string,
    position: string,
    componentName: string,
    date: any,
    groupId: number,
    compName: ComponentList
  ) {
    this.actionTriggered$.forEach((item) => {
      if (item.subscriber.includes(groupId.toString())) {
        item.subscription.next({
          target,
          position,
          componentName,
          date,
          groupId,
          compName,
        });
      }
    });
  }
}
