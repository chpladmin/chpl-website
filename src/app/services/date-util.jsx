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

const getDisplayDateFormat = (date) => {
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
  return 'N/A';
};

export {
  getDisplayDateFormat,
  jsJoda,
};
