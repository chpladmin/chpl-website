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
import cronstrue from 'cronstrue';

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
  day: {
    display: 'flex',
    flexWrap: 'wrap',
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
  dayOfTheMonthContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
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

function ChplCronGen(props) {
  const [cron, setCron] = useState('');
  const [days, setDays] = useState(new Set());
  const [nthWeekday, setNthWeekday] = useState('1');
  const [nthWeekdayDay, setNthWeekdayDay] = useState('2');
  const [selectedDom, setSelectedDom] = useState(jsJoda.LocalDate.now().dayOfMonth());
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
      setSelectedDom(parseInt(dom, 10));
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

  const handleDom = (event) => {
    const day = event.target.value;
    setSelectedDom(day);
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
        case 'dayOfMonth':
          updated = `0 ${utc.minute()} ${utc.hour()} ${selectedDom} * ? *`;
          break;
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
    selectedDom,
    formik.values.runTime,
  ]);

  return (
    <Card>
      <CardContent>
        <div className={classes.cron}>
          <Typography variant="subtitle2">Schedule:</Typography>
          { cron && cronstrue.toString(cron, { verbose: true, dayOfWeekStartIndexZero: false }) }
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
              <div className={classes.day}>
                <FormControlLabel
                  label="Sunday"
                  control={<Checkbox name="days" value="SUN" onChange={handleDays} checked={days.has('SUN')} />}
                />
                <FormControlLabel
                  label="Monday"
                  control={<Checkbox name="days" value="MON" onChange={handleDays} checked={days.has('MON')} />}
                />
                <FormControlLabel
                  label="Tuesday"
                  control={<Checkbox name="days" value="TUE" onChange={handleDays} checked={days.has('TUE')} />}
                />
                <FormControlLabel
                  label="Wednesday"
                  control={<Checkbox name="days" value="WED" onChange={handleDays} checked={days.has('WED')} />}
                />
                <FormControlLabel
                  label="Thursday"
                  control={<Checkbox name="days" value="THU" onChange={handleDays} checked={days.has('THU')} />}
                />
                <FormControlLabel
                  label="Friday"
                  control={<Checkbox name="days" value="FRI" onChange={handleDays} checked={days.has('FRI')} />}
                />
                <FormControlLabel
                  label="Saturday"
                  control={<Checkbox name="days" value="SAT" onChange={handleDays} checked={days.has('SAT')} />}
                />
              </div>
            </div>
          )}
        { dayType === 'dayOfMonth'
          && (
            <div className={classes.dayOfTheMonthContainer}>
              <ChplTextField
                select
                id="day-of-month"
                name="dayOfMonth"
                label="Day of Month"
                value={selectedDom}
                onChange={handleDom}
              >
                { Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <MenuItem value={day} key={day}>
                    { day }
                  </MenuItem>
                ))}
              </ChplTextField>
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
