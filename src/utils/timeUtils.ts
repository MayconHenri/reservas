import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(timezone);

export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
}

export function generateTimes(formattedDate: string, eventos: any[], item: any): any {
  const timePeriods = [
    { start: 8, end: 12, period: "morningHours", interval: 15, endHour: 11, endMinute: 45 },
    { start: 12, end: 18, period: "afternoonHours", interval: 15, endHour: 17, endMinute: 0 },
    { start: 17, end: 19, period: "eveningHours", interval: 15, endHour: 19, endMinute: 0 },
  ];

  const now = dayjs();
  const isToday = formattedDate === now.format("YYYY-MM-DD");

  timePeriods.forEach(({ start, end, period, interval, endHour, endMinute }) => {
    const hoursArray = [];
    for (let h = start; h <= endHour; h++) {
      for (let m = 0; m < 60; m += interval) {
        if (h === endHour && m > endMinute) break;

        let hour = h < 10 ? `0${h}` : h;
        let minute = m === 0 ? "00" : m;
        const hourFormatted = `${hour}:${minute}`;

        const isEventBlocked = eventos.some((event) => {
          const eventDate = dayjs(new Date(event.start.dateTime)).subtract(item.time, "minute");
          const eventEndDate = dayjs(event.end.dateTime);
          const eventDay = eventDate.format("YYYY-MM-DD");

          const eventStartHour = eventDate.hour();
          const eventStartMinute = eventDate.minute();
          const eventEndHour = eventEndDate.hour();
          const eventEndMinute = eventEndDate.minute();

          return (
            eventDay === formattedDate &&
            (eventStartHour < h || (eventStartHour === h && eventStartMinute <= m)) &&
            (eventEndHour > h || (eventEndHour === h && eventEndMinute > m))
          );
        });

        const isPastTime = isToday && (h < now.hour() || (h === now.hour() && m < now.minute()));

        hoursArray.push({ hour: hourFormatted, isDisabled: isEventBlocked || isPastTime });
      }
    }
    item[period] = hoursArray;
  });
}

export function isSelected(selectedTime: string, period: string, hour: string): boolean {
  return selectedTime === hour;
}

