import {
  number, object, shape, string,
} from 'prop-types';

const job = shape({
  description: string,
  group: string,
  jobDataMap: object,
  name: string,
});

const scheduledSystemTrigger = shape({
  description: string,
  name: string,
  nextRunDate: number,
  triggerScheduleType: string,
});

const trigger = shape({
  acb: string,
  cronSchedule: string,
  email: string,
  group: string,
  job,
  name: string,
});

export { job, scheduledSystemTrigger, trigger };
