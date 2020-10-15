/* eslint-disable prettier/prettier */
import {
  subMinutes,
  subHours,
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
} from 'date-fns';

const defineds = {
  now: new Date(),
  lastFiveMinutes: subMinutes(new Date(), 5),
  lastThirtyMinutes: subMinutes(new Date(), 30),
  lastHour: subHours(new Date(), 1),
  lastTwoHours: subHours(new Date(), 2),
  lastFourHours: subHours(new Date(), 4),
  lastEightHours: subHours(new Date(), 8),
  lastTwelveHours: subHours(new Date(), 12),
  lastEighteenHours: subHours(new Date(), 18),
  lastTwentyFourHours: subHours(new Date(), 24),
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfYear: startOfYear(new Date()),
  lastSevenDays: addDays(new Date(), -7),
  lastThirtyDays: addDays(new Date(), -30),
  lastYear: addDays(new Date(), -365),
};

const staticRangeHandler = {
  range: {},
  isSelected(range) {
    const definedRange = this.range();
    return (
      isSameDay(range.startDate, definedRange.startDate) &&
      isSameDay(range.endDate, definedRange.endDate)
    );
  },
};

export function createStaticRanges(ranges) {
  return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
}

export const defaultStaticRanges = createStaticRanges([
  // {
  //   label: 'Last 5 Minutes',
  //   range: () => ({
  //     startDate: defineds.lastFiveMinutes,
  //     endDate: defineds.endOfToday,
  //   }),
  // },
  // {
  //   label: 'Last 30 Minutes',
  //   range: () => ({
  //     startDate: defineds.lastThirtyMinutes,
  //     endDate: defineds.endOfToday,
  //   }),
  // },
  {
    label: 'Last Hour',
    range: () => ({
      startDate: defineds.lastHour,
      endDate: defineds.now,
    }),
  },
  {
    label: 'Last 4 Hours',
    range: () => ({
      startDate: defineds.lastFourHours,
      endDate: defineds.now,
    }),
  },
  {
    label: 'Last 8 Hours',
    range: () => ({
      startDate: defineds.lastEightHours,
      endDate: defineds.now,
    }),
  },
  {
    label: 'Last 24 Hours',
    range: () => ({
      startDate: defineds.lastTwentyFourHours,
      endDate: defineds.now,
    }),
  },
  {
    label: 'Last 7 Days',
    range: () => ({
      startDate: defineds.lastSevenDays,
      endDate: defineds.now,
    }),
  },
  {
    label: 'Last 30 Days',
    range: () => ({
      startDate: defineds.lastThirtyDays,
      endDate: defineds.now,
    }),
  },

  // {
  //   label: 'Last 365 Days',
  //   range: () => ({
  //     startDate: defineds.lastYear,
  //     endDate: defineds.now,
  //   }),
  // },
  {
    label: 'Month to Date',
    range: () => ({
      startDate: defineds.startOfMonth,
      endDate: defineds.now,
    }),
  },
  // {
  //   label: 'Year to Date',
  //   range: () => ({
  //     startDate: defineds.startOfYear,
  //     endDate: defineds.now,
  //   }),
  // },
  // {
  //   label: 'Last Month',
  //   range: () => ({
  //     startDate: defineds.startOfLastMonth,
  //     endDate: defineds.endOfLastMonth,
  //   }),
  // },
]);

export const defaultInputRanges = [
  {
    label: 'days up to today',
    range(value) {
      return {
        startDate: addDays(
          defineds.startOfToday,
          (Math.max(Number(value), 1) - 1) * -1
        ),
        endDate: defineds.endOfToday,
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
      if (!range.startDate) return '∞';
      return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
    },
  },
  // {
  //   label: 'days starting today',
  //   range(value) {
  //     const today = new Date();
  //     return {
  //       startDate: today,
  //       endDate: addDays(today, Math.max(Number(value), 1) - 1),
  //     };
  //   },
  //   getCurrentValue(range) {
  //     if (!isSameDay(range.startDate, defineds.startOfToday)) return '-';
  //     if (!range.endDate) return '∞';
  //     return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
  //   },
  // },
];
