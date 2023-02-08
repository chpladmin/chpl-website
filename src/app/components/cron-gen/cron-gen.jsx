import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Switch,
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
  datetimeLayout: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  },
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
  day: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  helperTextSpacing: {
    marginLeft: '14px',
  },
});

const validationSchema = yup.object({
  runTime: yup.string()
    .required('Run time must be entered'),
});

function ChplCronGen(props) {
  const [cron, setCron] = useState('');
  const [days, setDays] = useState(new Set());
  const [selectedDom, setSelectedDom] = useState(jsJoda.LocalDate.now().dayOfMonth());
  const [isWeekly, setIsWeekly] = useState(true);
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
    } else {
      setDays(() => new Set(day.split(',').filter((p) => p.length === 3)));
    }
    if (dom !== '1/1' && dom !== '?') {
      setSelectedDom(parseInt(dom, 10));
      setIsWeekly(false);
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

  const updateCron = () => {
    try {
      const utc = jsJoda.LocalDateTime
        .ofDateAndTime(jsJoda.LocalDate.now(), jsJoda.LocalTime.parse(formik.values.runTime))
        .atZone(jsJoda.ZoneId.of('America/New_York'))
        .withZoneSameInstant(jsJoda.ZoneId.of('UTC-00:00'));
      let updated;
      if (isWeekly) {
        const daySpecific = !(days.size === 0 || days.size === 7);
        updated = `0 ${utc.minute()} ${utc.hour()} ${daySpecific ? '?' : '1/1'} * ${daySpecific ? [...days].join(',') : '?'} *`;
      } else {
        updated = `0 ${utc.minute()} ${utc.hour()} ${selectedDom} * ? *`;
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

  useEffect(() => updateCron(), [days, isWeekly, selectedDom, formik.values.runTime]);

  return (
    <Card>
      <CardContent>
        <div className={classes.cron}>
          <Typography variant="subtitle2">Cron value:</Typography>
          <code className={classes.cronValue}>{cron}</code>
        </div>
        <Divider />
        <FormControlLabel
          control={(
            <Switch
              id="schedule-type"
              name="scheduleType"
              color="primary"
              checked={isWeekly}
              onChange={() => setIsWeekly(!isWeekly)}
            />
          )}
          label={isWeekly ? 'Weekly' : 'Monthly'}
        />
        <div className={classes.datetimeLayout}>
          { isWeekly
            && (
              <div>
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
          { !isWeekly
            && (
              <div>
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
          <div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChplCronGen;

ChplCronGen.propTypes = {
  initialValue: string.isRequired,
  dispatch: func.isRequired,
};
