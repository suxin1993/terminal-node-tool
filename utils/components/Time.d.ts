declare class DateUtil {
    private DateObj: Date
    private initDate(...dateArgs?: []): DateConstructor;
    private formatDate(date: Date, format?: string): string;
    constructor(...dateArgs?: []) { }

    timestamp(...dateArgs?: []): number;
    timestamp10(...dateArgs?: []): number;
    dateFormat(...dateArgs?: []): string;
    dateFormat(...dateArgs?: [], format?: string): string;
    timeFormat(timestamp?: number): string;
}

export default DateUtil;