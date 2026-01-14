import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with commonly used plugins to mimic moment features
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Create a lightweight moment-compatible shim that wraps dayjs
function momentShallow(...args: any[]) {
  return dayjs(...args);
}

// Attach common static methods used by libraries
(momentShallow as any).utc = (...args: any[]) => (dayjs as any).utc(...args);
(momentShallow as any).tz = (...args: any[]) => (dayjs as any).tz(...args);
(momentShallow as any).isDayjs = (obj: any) => !!obj && obj.$d !== undefined;

export default momentShallow;
