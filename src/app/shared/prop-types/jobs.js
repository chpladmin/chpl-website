import {
  number, object, shape, string,
} from 'prop-types';

const jobType = shape({
  description: string,
  group: string,
  jobDataMap: object,
  name: string,
});

const job = shape({
  acb: string,
  cronSchedule: string,
  email: string,
  group: string,
  job: jobType,
  name: string,
});

const scheduledSystemJob = shape({
  description: string,
  name: string,
  nextRunDate: number,
  triggerScheduleType: string,
});

export { job, jobType, scheduledSystemJob };
