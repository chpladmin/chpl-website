import '../../../node_modules/@js-joda/timezone';
import { Locale } from '../../../node_modules/@js-joda/locale_en-us';
import * as jsJoda from '../../../node_modules/@js-joda/core';

const isLocalDateTime = (dateTimeToTest) => {
  try {
    jsJoda.LocalDateTime.parse(dateTimeToTest);
    return true;
  } catch (err) {
    return false;
  }
};

const getDisplayDateFormat = (date) => {
  const formatter = jsJoda.DateTimeFormatter.ofPattern('MMM d, y h:mm:ss a').withLocale(Locale.US);
  if (typeof (date) === 'number') {
    return jsJoda.ZonedDateTime
      .ofInstant(jsJoda.Instant.ofEpochMilli(date), jsJoda.ZoneId.of('America/New_York'))
      .format(formatter);
  }
  if (typeof (date) === 'string' && isLocalDateTime(date)) {
    return jsJoda.LocalDateTime.parse(date).format(formatter);
  }
  return 'N/A';
};

export {
  getDisplayDateFormat,
  jsJoda,
};
