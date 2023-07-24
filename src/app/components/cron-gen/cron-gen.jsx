import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Tab,
  Tabs,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as jsJoda from '@js-joda/core';
import '@js-joda/timezone';

import { ChplTextField } from 'components/util';
import theme from 'themes/theme';

const useStyles = makeStyles({
  cron: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  },
  cronValue: {
    color: '#156dac',
    backgroundColor: '#599bde15',
    borderRadius: '64px',
    padding: '8px',
    fontWeight: '800',
    maxWidth: 'max-content',
  },
  helperTextSpacing: {
    marginLeft: '14px',
  },
  nthWeekDayContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    padding: '32px 0 16px 0',
  },
  dailyContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px 0',
  },
  nthWeekDay: {
    width: '32%',
  },
});

const validationSchema = yup.object({
  runTime: yup.string()
    .required('Run time must be entered'),
});

const getCheckbox = (display, name, value, onChange, state) => (
  <FormControlLabel
    label={display}
    key={value}
    control={<Checkbox color="primary" name={name} value={value} onChange={onChange} checked={state.has(value)} />}
  />
);

function ChplCronGen(props) {
  const [cron, setCron] = useState('');
  const [days, setDays] = useState(new Set());
  const [selectedDaysOfMonth, setSelectedDaysOfMonth] = useState(new Set().add(`${jsJoda.LocalDate.now().dayOfMonth()}`));
  const [nthWeekday, setNthWeekday] = useState('1');
  const [nthWeekdayDay, setNthWeekdayDay] = useState('2');
  const [dayType, setDayType] = useState('daily');
  const classes = useStyles();

  let formik;

  useEffect(() => {
    const [, minute, hour, dom, , day] = props.initialValue.split(' ');
    const time = jsJoda.ZonedDateTime
      .of3(jsJoda.LocalDate.now(),
        jsJoda.LocalTime.parse(`${hour.length === 1 ? `0${hour}` : hour}:${minute.length === 1 ? `0${minute}` : minute}`),
        jsJoda.ZoneId.of('UTC-00:00'))
      .withZoneSameInstant(jsJoda.ZoneId.of('America/New_York'))
      .toLocalTime()
      .toString();
    formik.setFieldValue('runTime', time);
    if (day === '?') {
      setDays(() => new Set());
    } else if (day.includes('#')) {
      setDays(() => new Set());
      const [nthDay, nth] = day.split('#');
      setNthWeekday(nth);
      setNthWeekdayDay(nthDay);
      setDayType('nthWeekday');
    } else {
      setDays(() => new Set(day.split(',').filter((p) => p.length === 3)));
    }
    if (dom !== '1/1' && dom !== '?' && dom !== '*') {
      setSelectedDaysOfMonth(() => new Set(dom.split(',')));
      setDayType('dayOfMonth');
    }
    setCron(props.initialValue);
  }, []);

  const handleDays = (event) => {
    const day = event.target.value;
    const adding = event.target.checked;
    if (adding) {
      setDays((prev) => new Set(prev.add(day)));
    } else {
      setDays((prev) => new Set([...prev].filter((x) => x !== day)));
    }
  };

  const handleDaysOfMonth = (event) => {
    const day = event.target.value;
    const adding = event.target.checked;
    if (adding) {
      setSelectedDaysOfMonth((prev) => new Set(prev.add(day)));
    } else {
      setSelectedDaysOfMonth((prev) => new Set([...prev].filter((x) => x !== day)));
    }
  };

  const handleNthWeekday = (event) => {
    const nth = event.target.value;
    setNthWeekday(nth);
  };

  const handleNthWeekdayDay = (event) => {
    const day = event.target.value;
    setNthWeekdayDay(day);
  };

  const updateCron = () => {
    try {
      const utc = jsJoda.LocalDateTime
        .ofDateAndTime(jsJoda.LocalDate.now(), jsJoda.LocalTime.parse(formik.values.runTime))
        .atZone(jsJoda.ZoneId.of('America/New_York'))
        .withZoneSameInstant(jsJoda.ZoneId.of('UTC-00:00'));
      let updated;
      switch (dayType) {
        case 'daily': {
          const daySpecific = !(days.size === 0 || days.size === 7);
          updated = `0 ${utc.minute()} ${utc.hour()} ${daySpecific ? '?' : '1/1'} * ${daySpecific ? [...days].join(',') : '?'} *`;
          break;
        }
        case 'dayOfMonth': {
          const daySelected = !(selectedDaysOfMonth.size === 0 || selectedDaysOfMonth.size === 31);
          updated = `0 ${utc.minute()} ${utc.hour()} ${daySelected ? [...selectedDaysOfMonth].join(',') : '1/1'} * ? *`;
          break;
        }
        case 'nthWeekday':
          updated = `0 ${utc.minute()} ${utc.hour()} ? * ${nthWeekdayDay}#${nthWeekday} *`;
          break;
          // no default
      }
      setCron(updated);
      props.dispatch(updated);
    } catch {
      // noop
    }
  };

  formik = useFormik({
    initialValues: {
      runTime: '04:00',
    },
    validationSchema,
  });

  useEffect(() => updateCron(), [
    days,
    dayType,
    nthWeekday,
    nthWeekdayDay,
    selectedDaysOfMonth,
    formik.values.runTime,
  ]);

  return (
    <Card>
      <CardContent>
        <div className={classes.cron}>
          <Typography variant="subtitle2">Schedule:</Typography>
          <code className={classes.cronValue}>{cron}</code>
        </div>
        <AppBar elevation={1} position="static" color="transparent">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            value={dayType}
          >
            <Tab label="Daily" value="daily" onClick={() => setDayType('daily')} />
            <Tab label="Day of Month" value="dayOfMonth" onClick={() => setDayType('dayOfMonth')} />
            <Tab label="Nth Weekday" value="nthWeekday" onClick={() => setDayType('nthWeekday')} />
          </Tabs>
        </AppBar>
        { dayType === 'daily'
          && (
            <div className={classes.dailyContainer}>
              <Typography variant="subtitle2">Every:</Typography>
              <div>
                { getCheckbox('Sunday', 'days', 'SUN', handleDays, days) }
                { getCheckbox('Monday', 'days', 'MON', handleDays, days) }
                { getCheckbox('Tuesday', 'days', 'TUE', handleDays, days) }
                { getCheckbox('Wednesday', 'days', 'WED', handleDays, days) }
                { getCheckbox('Thursday', 'days', 'THU', handleDays, days) }
                { getCheckbox('Friday', 'days', 'FRI', handleDays, days) }
                { getCheckbox('Saturday', 'days', 'SAT', handleDays, days) }
              </div>
            </div>
          )}
        { dayType === 'dayOfMonth'
          && (
            <div className={classes.dailyContainer}>
              <Typography variant="subtitle2">Every:</Typography>
              <div>
                { Array.from({ length: 31 }, (_, i) => i + 1).map((day) => getCheckbox(`${day}`, 'daysOfMonth', `${day}`, handleDaysOfMonth, selectedDaysOfMonth))}
              </div>
            </div>
          )}
        { dayType === 'nthWeekday'
          && (
            <div className={classes.nthWeekDayContainer}>
              <Typography variant="subtitle2">On the</Typography>
              <ChplTextField
                select
                id="nth-weekday"
                name="nthWeekday"
                label="Nth"
                value={nthWeekday}
                onChange={handleNthWeekday}
                className={classes.nthWeekDay}
              >
                <MenuItem value="1" key="first">First</MenuItem>
                <MenuItem value="2" key="second">Second</MenuItem>
                <MenuItem value="3" key="third">Third</MenuItem>
                <MenuItem value="4" key="fourth">Fourth</MenuItem>
                <MenuItem value="5" key="fifth">Fifth</MenuItem>
              </ChplTextField>
              <ChplTextField
                select
                id="nth-weekday-day"
                name="nthWeekdayDay"
                label="Day"
                value={nthWeekdayDay}
                onChange={handleNthWeekdayDay}
                className={classes.nthWeekDay}
              >
                <MenuItem value="1" key="sunday">Sunday</MenuItem>
                <MenuItem value="2" key="monday">Monday</MenuItem>
                <MenuItem value="3" key="tuesday">Tuesday</MenuItem>
                <MenuItem value="4" key="wednesday">Wednesday</MenuItem>
                <MenuItem value="5" key="thursday">Thursday</MenuItem>
                <MenuItem value="6" key="friday">Friday</MenuItem>
                <MenuItem value="7" key="saturday">Saturday</MenuItem>
              </ChplTextField>
              <Typography variant="subtitle2">of the month</Typography>
            </div>
          )}
        <Typography gutterBottom variant="subtitle2">At:</Typography>
        <ChplTextField
          id="run-time"
          name="runTime"
          label="Run Time"
          type="time"
          required
          value={formik.values.runTime}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.runTime && !!formik.errors.runTime}
          helperText={formik.touched.runTime && formik.errors.runTime}
        />
        <FormHelperText className={classes.helperTextSpacing}> All times should be entered as Eastern Time (ET)</FormHelperText>
      </CardContent>
    </Card>
  );
}

export default ChplCronGen;

ChplCronGen.propTypes = {
  initialValue: string.isRequired,
  dispatch: func.isRequired,
};
