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
import ChplCronGen from 'components/cron-gen';
import { ChplTextField } from 'components/util';
import { acb as acbPropType, trigger as triggerType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
});

function ChplUserTriggerEdit(props) {
  const { dispatch } = props;
  const [acbs, setAcbs] = useState([]);
  const [trigger, setTrigger] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setTrigger({
      ...props.trigger,
    });
    formik.setFieldValue('email', props.trigger.email);
    if (props.trigger.job.jobDataMap.acbSpecific) {
      const selected = props.trigger.acb?.split(',').map((id) => parseInt(id, 10)) || props.acbs.filter((acb) => !acb.retired).map((acb) => acb.id);
      setAcbs(props.acbs.sort((a, b) => (a.name < b.name ? -1 : 1))
        .map((acb) => ({
          ...acb,
          selected: selected.includes(acb.id),
          label: `${acb.name}${acb.retired ? ' (Retired)' : ''}`,
        })));
    }
  }, [props.acbs, props.trigger]); // eslint-disable-line react/destructuring-assignment

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
        dispatch({ action: 'delete', payload: trigger });
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
      email: trigger.email || '',
    },
    onSubmit: () => {
      const payload = {
        ...trigger,
        email: formik.values.email,
        acb: acbs.filter((acb) => acb.selected).map((acb) => acb.id).join(','),
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
          className={classes.cardHeader}
          titleTypographyProps={{ variant: 'h6' }}
          title={`${trigger.id ? 'Edit' : 'Create'} Job: ${trigger.job.name}`}
        />
        <CardContent className={classes.container}>
          <Typography>
            Job Name
            <br />
            { trigger.job.name }
          </Typography>
          <Typography>
            Job Description
            <br />
            { trigger.job.description }
          </Typography>
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
          { trigger.job.jobDataMap.acbSpecific
            && (
              <div>
                <ul aria-label="ONC-ACBs available to schedule">
                  { acbs.map((acb) => (
                    <li key={acb.id}>
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
                    </li>
                  ))}
                </ul>
                { !isAcbSelectionValid()
                  && (
                    <Typography>At least one ONC-ACB must be selected</Typography>
                  )}
              </div>
            )}
          <ChplCronGen
            initialValue={trigger.cronSchedule || '0 0 4 1/1 * ? *'}
            dispatch={handleCronDispatch}
          />
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
