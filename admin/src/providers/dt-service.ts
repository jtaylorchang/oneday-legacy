import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class DtService {
  public DAY_SUNDAY: number = 0;
  public DAY_MONDAY: number = 1;
  public DAY_TUESDAY: number = 2;
  public DAY_WEDNESDAY: number = 3;
  public DAY_THURSDAY: number = 4;
  public DAY_FRIDAY: number = 5;
  public DAY_SATURDAY: number = 6;

  constructor(public http: Http) {}

  //convert a standard Date() object into a standard and easy parsing format of YYYY-MM-DD
  getDateModFromDate(date): string {
    var year = date.getFullYear(); //returns YYYY ie. 2017
    var month = date.getMonth() + 1; //returns the month as an integer zero-based so add 1 to match user supplied dates
    var day = date.getDate(); //returns DD ie. 1 or 25 or 17 etc

    var yearS: string = year.toString();
    var monthS: string;
    var dayS: string;

    //since the day and month variables were numbers, they aren't necessarily 2 digits. (1 - 9)
    if (month.toString().length == 1) {
      monthS = "0" + month.toString();
    } else {
      monthS = month.toString();
    }
    if (day.toString().length == 1) {
      dayS = "0" + day.toString();
    } else {
      dayS = day.toString();
    }

    //create the final string of the format YYYY-MM-DD
    var mod: string = yearS + "-" + monthS + "-" + dayS;
    return mod;
  }

  //breaks down a YYYY-MM-DD format into the respective components and create a Date() object using them
  getDateFromDateMod(dateMod: string): Date {
    var d = new Date();
    d.setFullYear(this.getYear(dateMod));
    d.setDate(this.getDay(dateMod));
    d.setMonth(this.getMonth(dateMod) - 1); //since months was zero based and I added 1, remove the 1 to convert back to zero based
    return d;
  }

  //get the number of days in a month (zero based)
  daysInMonth(month, year): number {
    //create a new date object, set it to the year and month without any change
    //since the month is zero based and the supplied month parameter is not, it will be one month too far
    //set the day to 0 because this defaults it backwards one month to the last day of that month
    //then get the day number of the new date
    return new Date(year, month, 0).getDate();
  }

  //get the YYYY-MM-DD in the future or past relative to the supplied YYYY-MM-DD
  getDeltaDate(dateModCurrent, delta: number): string {
    var d: Date = this.getDeltaDateRaw(dateModCurrent, delta);
    var dM: string = this.getDateModFromDate(d);
    return dM;
  }

  getDeltaDateRaw(dateModCurrent, delta: number): Date {
    var deltaYear: number;
    var deltaMonth: number;
    var deltaDay: number;
    var recYear: number = this.getYear(dateModCurrent);
    var recMonth: number = this.getMonth(dateModCurrent);
    var recDay: number = this.getDay(dateModCurrent);
    var newDate: Date = new Date();

    deltaYear = recYear;
    if (recDay + delta > this.daysInMonth(recMonth, recYear)) {
      deltaDay = recDay + delta - this.daysInMonth(recMonth, recYear);
      deltaMonth = recMonth;
      if (deltaMonth == 13) {
        deltaMonth = 1;
        deltaYear += 1;
      }
      newDate.setFullYear(deltaYear);
      newDate.setDate(deltaDay);
      newDate.setMonth(deltaMonth);
    } else if (recDay + delta < 0) {
      deltaMonth = recMonth - 2;
      deltaDay = this.daysInMonth(recMonth - 1, recYear) + (recDay + delta);
      newDate.setFullYear(deltaYear);
      newDate.setMonth(deltaMonth);
      newDate.setDate(deltaDay);
    } else if (recDay + delta == 0) {
      deltaMonth = recMonth - 2;
      deltaDay = this.daysInMonth(recMonth - 1, recYear) + (recDay + delta);
      if (deltaDay > this.daysInMonth(deltaMonth, deltaYear)) {
        newDate.setFullYear(deltaYear);
        newDate.setDate(deltaDay);
        newDate.setMonth(deltaMonth);
      } else {
        newDate.setFullYear(deltaYear);
        newDate.setMonth(deltaMonth);
        newDate.setDate(deltaDay);
      }
    } else {
      deltaMonth = recMonth - 1;
      deltaDay = recDay + delta;
      newDate.setFullYear(deltaYear);
      newDate.setDate(deltaDay);
      newDate.setMonth(deltaMonth);
    }

    return newDate;
  }

  getDayOfWeek(dateMod: string): number {
    var testDate: Date = this.getDateFromDateMod(dateMod);
    return testDate.getDay();
  }

  //dateMod format is YYYY-MM-DD therefore take a substring of the desired part and convert to integer
  getYear(dateMod): number {
    return parseInt(dateMod.substring(0, 4));
  }
  getMonth(dateMod): number {
    return parseInt(dateMod.substring(5, 7));
  }
  getDay(dateMod): number {
    return parseInt(dateMod.substring(8, 10));
  }

  //YYYY-MM-DD --> YYYYMMDD
  convertDateModToNumber(date: string): number {
    var year = this.getYear(date);
    var month = this.getMonth(date);
    var day = this.getDay(date);
    var idNumber: number = year * 10000 + month * 100 + day;
    return idNumber;
  }

  shiftOffWeekends(): string {
    var dateMod = this.getDateModFromDate(new Date());
    var currentDay = this.getDayOfWeek(dateMod);
    if (currentDay == this.DAY_SATURDAY) {
      dateMod = this.getDeltaDate(dateMod, 2);
    } else if (currentDay == this.DAY_SUNDAY) {
      dateMod = this.getDeltaDate(dateMod, 1);
    }
    return dateMod;
  }

  getWorkWeek(dateMod) {
    var currentDay = this.getDayOfWeek(dateMod);
    var week = [
      "YYYY-MM-DD",
      "YYYY-MM-DD",
      "YYYY-MM-DD",
      "YYYY-MM-DD",
      "YYYY-MM-DD",
    ];
    switch (currentDay) {
      case this.DAY_MONDAY:
        week[0] = dateMod;
        week[1] = this.getDeltaDate(dateMod, 1);
        week[2] = this.getDeltaDate(dateMod, 2);
        week[3] = this.getDeltaDate(dateMod, 3);
        week[4] = this.getDeltaDate(dateMod, 4);
        break;
      case this.DAY_TUESDAY:
        week[0] = this.getDeltaDate(dateMod, -1);
        week[1] = dateMod;
        week[2] = this.getDeltaDate(dateMod, 1);
        week[3] = this.getDeltaDate(dateMod, 2);
        week[4] = this.getDeltaDate(dateMod, 3);
        break;
      case this.DAY_WEDNESDAY:
        week[0] = this.getDeltaDate(dateMod, -2);
        week[1] = this.getDeltaDate(dateMod, -1);
        week[2] = dateMod;
        week[3] = this.getDeltaDate(dateMod, 1);
        week[4] = this.getDeltaDate(dateMod, 2);
        break;
      case this.DAY_THURSDAY:
        week[0] = this.getDeltaDate(dateMod, -3);
        week[1] = this.getDeltaDate(dateMod, -2);
        week[2] = this.getDeltaDate(dateMod, -1);
        week[3] = dateMod;
        week[4] = this.getDeltaDate(dateMod, 1);
        break;
      case this.DAY_FRIDAY:
        week[0] = this.getDeltaDate(dateMod, -4);
        week[1] = this.getDeltaDate(dateMod, -3);
        week[2] = this.getDeltaDate(dateMod, -2);
        week[3] = this.getDeltaDate(dateMod, -1);
        week[4] = dateMod;
        break;
    }
    return week;
  }

  getDayOfWeekLetter(n) {
    var s = "";
    switch (n) {
      case this.DAY_SUNDAY:
        s = "S";
        break;
      case this.DAY_MONDAY:
        s = "M";
        break;
      case this.DAY_TUESDAY:
        s = "T";
        break;
      case this.DAY_WEDNESDAY:
        s = "W";
        break;
      case this.DAY_THURSDAY:
        s = "T";
        break;
      case this.DAY_FRIDAY:
        s = "F";
        break;
      case this.DAY_SATURDAY:
        s = "S";
        break;
    }
    return s;
  }
}
