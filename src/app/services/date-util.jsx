import '@js-joda/timezone';
import { Locale } from '@js-joda/locale_en-us';
import * as jsJoda from '@js-joda/core';

const isLocalDate = (dateToTest) => {
  try {
    jsJoda.LocalDate.parse(dateToTest);
    return true;
  } catch (err) {
    return false;
  }
};

const isLocalDateTime = (dateTimeToTest) => {
  try {
    jsJoda.LocalDateTime.parse(dateTimeToTest);
    return true;
  } catch (err) {
    return false;
  }
};

const getCodeSetFormat = (date) => jsJoda
  .LocalDate
  .parse(date)
  .format(jsJoda
    .DateTimeFormatter
    .ofPattern('MMM y')
    .withLocale(Locale.US));

const getDisplayDateFormat = (date, fallback = 'N/A') => {
  const timeFormatter = jsJoda.DateTimeFormatter.ofPattern('MMM d, y h:mm:ss a').withLocale(Locale.US);
  const dateFormatter = jsJoda.DateTimeFormatter.ofPattern('MMM d, y').withLocale(Locale.US);
  if (typeof (date) === 'number') {
    return jsJoda.ZonedDateTime
      .ofInstant(jsJoda.Instant.ofEpochMilli(date), jsJoda.ZoneId.of('America/New_York'))
      .format(timeFormatter);
  }
  if (typeof (date) === 'string' && isLocalDate(date)) {
    return jsJoda.LocalDate.parse(date).format(dateFormatter);
  }
  if (typeof (date) === 'string' && isLocalDateTime(date)) {
    return jsJoda.LocalDateTime.parse(date).format(timeFormatter);
  }
  return fallback;
};

const toTimestamp = (date) => {
  if (typeof (date) === 'string' && isLocalDate(date)) {
    const localDate = jsJoda.LocalDate.parse(date).plusDays(1);
    const localTime = jsJoda.LocalTime.MIDNIGHT;
    return jsJoda
      .ZonedDateTime
      .of3(localDate, localTime, jsJoda.ZoneId.of('America/New_York'))
      .toInstant()
      .toEpochMilli();
  }
  return undefined;
};

export {
  getCodeSetFormat,
  getDisplayDateFormat,
  jsJoda,
  toTimestamp,
};
