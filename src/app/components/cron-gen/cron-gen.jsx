import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../themes/theme';
import { ChplTextField } from '../util';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    gap:'16px',
    margin:'16px 0',
  },
  cron:{
    display: 'flex',
    gap:'8px',
    flexDirection:'row',
    alignItems:'center',
  },
  cronValue:{
    color: '#156dac',
    backgroundColor:'#599bde15',
    borderRadius:'64px',
    padding:'8px',
    fontWeight:'800',
  },
  time:{
    display: 'flex',
    gap:'8px',
    flexDirection:'row',
    alignItems:'center',
  },
  day: {
    display: 'flex',
    flexDirection:'row',
    flexWrap:'wrap',
   },
});

const validationSchema = yup.object({
  hour: yup.number()
    .min(0, 'Hour must be positive')
    .max(23, 'Hour must be less than 24')
    .integer('Hour must be an integer')
    .required('Hour is required'),
  minute: yup.number()
    .min(0, 'Minute must be positive')
    .max(59, 'Minute must be less than 60')
    .integer('Minute must be an integer')
    .required('Minute is required'),
});

function ChplCronGen(props) {
  const [cron, setCron] = useState('');
  const [days, setDays] = useState(new Set());
  const classes = useStyles();

  let formik;

  useEffect(() => {
    const parts = props.initialValue.split(' ');
    formik.setFieldValue('minute', parts[1]);
    formik.setFieldValue('hour', parts[2]);
    if (parts[5] === '?') {
      setDays(() => new Set());
    } else {
      setDays(() => new Set(parts[5].split(',').filter((p) => p.length === 3)));
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

  const updateCron = () => {
    let updated;
    if (days.size === 0 || days.size === 7) {
      updated = `0 ${formik.values.minute} ${formik.values.hour} 1/1 * ? *`;
    } else {
      updated = `0 ${formik.values.minute} ${formik.values.hour} ? * ${[...days].join(',')} *`;
    }
    setCron(updated);
    props.dispatch(updated);
  };

  formik = useFormik({
    initialValues: {
      hour: 4,
      minute: 0,
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  useEffect(() => updateCron(), [days, formik.values.hour, formik.values.minute]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.content}>
        <Card>
        <CardContent>
        <div className={classes.cron}>
         <Typography variant="subtitle2">Cron value:</Typography> 
          <code className={classes.cronValue}>{cron}</code>
        </div>
        <Divider/>
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
        <Typography gutterBottom variant="subtitle2"> At:</Typography>
        <div className={classes.time}>
          <ChplTextField
            id="hour"
            name="hour"
            label="Hour"
            required
            value={formik.values.hour}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.hour && !!formik.errors.hour}
            helperText={formik.touched.hour && formik.errors.hour}
          />
          <ChplTextField
            id="minute"
            name="minute"
            label="Minute"
            required
            value={formik.values.minute}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.minute && !!formik.errors.minute}
            helperText={formik.touched.minute && formik.errors.minute}
          />
        </div>
      </CardContent>
      </Card>
      </div>
    </ThemeProvider>
  );
}

export default ChplCronGen;

ChplCronGen.propTypes = {
  initialValue: string.isRequired,
  dispatch: func.isRequired,
};
