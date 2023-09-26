import { Settings } from './interface';

export class DateModel {
  startDate: Date;
  endDate: Date;
  singleDate: Date;
}

export class DatePickerData {
  selectedDate: DateModel = new DateModel();
  navStateDate: DateModel = new DateModel();
  dateSettings: Settings;
  selectedRange: number[];
  selectSequenceFlag = 1;
  instanceId = Math.floor(Math.random() * 100000000);
}

export class ComponentList {
  yearList: boolean;
  monthList: boolean;
}
