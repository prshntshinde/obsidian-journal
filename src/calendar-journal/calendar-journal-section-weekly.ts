import { moment } from "obsidian";
import { WeeklyCalendarSection } from "../contracts/config.types";
import { MomentDate } from "../contracts/date.types";
import { CalendarJournalSection } from "./calendar-journal-section";
import { extractCurrentlocaleData } from "../utils/moment";

export class CalendarJournalSectionWeekly extends CalendarJournalSection<WeeklyCalendarSection> {
  getRangeStart(date?: string): MomentDate {
    const base = date ? moment(date) : moment();
    if (this.config.firstDayOfWeek < 0) {
      return base.startOf(this.granularity);
    }
    base.locale(this.locale);
    return base.startOf(this.granularity);
  }

  getRangeEnd(date?: string): MomentDate {
    const base = date ? moment(date) : moment();
    if (this.config.firstDayOfWeek < 0) {
      return base.endOf(this.granularity);
    }
    base.locale(this.locale);
    return base.endOf(this.granularity);
  }

  get locale(): string {
    const localeID = this.journal.id;
    if (!moment.locales().includes(localeID)) {
      moment.defineLocale(localeID, extractCurrentlocaleData());
    }
    moment.updateLocale(localeID, {
      week: {
        dow: this.config.firstDayOfWeek,
        doy: 7 + this.config.firstDayOfWeek - (this.config.firstWeekOfYear ?? 1),
      },
    });
    return localeID;
  }
}
