export interface Settings {
    bigBanner?: Boolean;
    format: string;
    defaultOpen?: Boolean;
    closeOnSelect?: boolean;
    rangepicker?: boolean;
    setDefaultValue?: boolean;
    defaultStartYear?: any;
    minYear?: number;
    maxYear?: number;
    minDate?: Date;
    maxDate?: Date;
}

export class Settings {
    [x: string]: any;
    public static globalsettings: any;
    public static globalattributes: any = [];
    public static buttonColor: any;
    public static buttonBackground: any;
  }
  
