import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import ChplCronGen from 'components/cron-gen/cron-gen';
import { ChplTextField } from 'components/util';
import { acb as acbPropType, trigger as triggerType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  cardContainer: {
    display: 'grid',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 2fr',
      alignItems: 'start',
    },
  },
  subContainer: {
    gap: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  subHeaderColor: {
    color: '#000000',
  },
  acbGrid: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
  range: yup.number()
    .required('Range is required')
    .min(1, 'Must be at least 1')
    .max(365, 'May be no more than 365'),
});

function ChplUserTriggerEdit(props) {
  const { dispatch } = props;
  /* eslint-disable react/destructuring-assignment */
  const [acbs, setAcbs] = useState(
    props.acbs
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((acb) => ({
        ...acb,
        selected: !acb.retired,
        label: `${acb.name}${acb.retired ? ' (Retired)' : ''}`,
      })),
  );
  /* eslint-enable react/destructuring-assignment */
  const [showRange, setShowRange] = useState(false);
  const [trigger, setTrigger] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setTrigger(props.trigger);
    formik.setFieldValue('email', props.trigger.email || '');
    if (props.trigger.job.jobDataMap.parameters) {
      setShowRange(true);
      formik.setFieldValue('range', props.trigger.job.jobDataMap.range);
    }
    if (props.trigger.job?.jobDataMap.acbSpecific) {
      const selected = props.trigger.acb?.split(',')
            .map((id) => parseInt(id, 10));
      if (selected) {
        setAcbs((previous) => previous.map((acb) => ({
          ...acb,
          selected: selected.includes(acb.id),
        })));
      }
    }
  }, [props.trigger]); // eslint-disable-line react/destructuring-assignment

  const handleAcbToggle = (clicked) => {
    setAcbs(acbs.map((acb) => ({
      ...acb,
      selected: acb.id === clicked.id ? !acb.selected : acb.selected,
    })));
  };

  const handleBarDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'close' });
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: { ...trigger, successMessage: 'Job deleted: Recurring job deleted' } });
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const handleCronDispatch = (payload) => {
    setTrigger({
      ...trigger,
      cronSchedule: payload,
    });
  };

  const isAcbSelectionValid = () => !trigger.job.jobDataMap.acbSpecific || acbs.filter((acb) => acb.selected).length > 0;

  formik = useFormik({
    initialValues: {
      email: props.trigger.email || '', // eslint-disable-line react/destructuring-assignment
      range: 7,
    },
    onSubmit: () => {
      const payload = {
        ...trigger,
        email: formik.values.email,
        acb: acbs.filter((acb) => acb.selected).map((acb) => acb.id).join(','),
        job: {
          ...trigger.job,
          jobDataMap: {
            ...trigger.job.jobDataMap,
            range: formik.values.range,
          },
        },
      };
      props.dispatch({ action: 'save', payload });
      formik.setSubmitting(false);
    },
    validationSchema,
  });

  if (!trigger.job) { return null; }

  return (
    <>
      <Card>
        <CardHeader
          titleTypographyProps={{ gutterBottom: true, variant: 'h5' }}
          title={`${trigger.name ? 'Edit' : 'Schedule'} Report: ${trigger.job.name}`}
          subheader={(
            <Typography className={classes.subHeaderColor} variant="body1">
              {trigger.job.description}
            </Typography>
          )}
        />
        <CardContent className={classes.cardContainer}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="subtitle1">Send the report to?</Typography>
              <ChplTextField
                id="email"
                name="email"
                label="Email"
                required
                disabled={!!trigger.name}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
              />
            </CardContent>
          </Card>
          <div className={classes.subContainer}>
            { showRange
            && (
            <Card>
              <CardContent>
                <Typography gutterBottom variant="subtitle1">How much time should the report cover?</Typography>
                <ChplTextField
                  id="range"
                  name="range"
                  label="Range (in days)"
                  type="number"
                  required
                  value={formik.values.range}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.range && !!formik.errors.range}
                  helperText={formik.touched.range && formik.errors.range}
                />
              </CardContent>
            </Card>
            )}
            <ChplCronGen
              initialValue={trigger.cronSchedule || '0 0 4 1/1 * ? *'}
              dispatch={handleCronDispatch}
            />
            { trigger.job.jobDataMap.acbSpecific
            && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1">ONC-ACBs available to schedule</Typography>
                <div className={classes.acbGrid} aria-label="ONC-ACBs available to schedule">
                  { acbs.map((acb) => (
                    <div key={acb.id}>
                      <FormControlLabel
                        control={(
                          <Switch
                            id={`toggle-${acb.id}`}
                            name={`toggle${acb.id}`}
                            color="primary"
                            checked={acb.selected}
                            onChange={() => handleAcbToggle(acb)}
                          />
                        )}
                        label={acb.label}
                      />
                    </div>
                  ))}
                </div>
                { !isAcbSelectionValid()
                  && (
                    <Typography>At least one ONC-ACB must be selected</Typography>
                  )}
              </CardContent>
            </Card>
            )}
          </div>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleBarDispatch}
        isDisabled={!formik.isValid || formik.isSubmitting || !isAcbSelectionValid()}
        canDelete={!!trigger.name}
      />
    </>
  );
}

export default ChplUserTriggerEdit;

ChplUserTriggerEdit.propTypes = {
  acbs: arrayOf(acbPropType).isRequired,
  dispatch: func.isRequired,
  trigger: triggerType.isRequired,
};
