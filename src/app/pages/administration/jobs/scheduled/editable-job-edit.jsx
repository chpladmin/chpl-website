import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { jobType } from 'shared/prop-types';
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
    .email('Enter a valid email'),
});

function ChplEditableJobEdit(props) {
  const { dispatch } = props;
  const [job, setJob] = useState({});
  const [emails, setEmails] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setJob(props.job);
    setEmails(props.job.jobDataMap.email.split(','));
  }, [props.job]); // eslint-disable-line react/destructuring-assignment

  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'close' });
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const add = () => {
    setEmails([...new Set([...emails, formik.values.email])]);
    formik.resetForm();
  };

  const remove = (item) => {
    setEmails(emails.filter((ele) => ele !== item));
  };

  formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: () => {
      const payload = {
        ...job,
        jobDataMap: {
          ...job.jobDataMap,
          email: emails.join(','),
        },
      };
      props.dispatch({ action: 'save', payload });
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader
          className={classes.cardHeader}
          titleTypographyProps={{ variant: 'h6' }}
          title={`Edit Job: ${job.name}`}
        />
        <CardContent className={classes.container}>
          <Typography>
            Job Name
            <br />
            { job.name }
          </Typography>
          <Typography>
            Job Description
            <br />
            { job.description }
          </Typography>
          <div>
            <Typography>Subscribers</Typography>
            <ul>
              { emails.map((item) => (
                <li key={item}>
                  {item}
                  <Button
                    onClick={() => remove(item)}
                    variant="contained"
                    color="primary"
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ChplTextField
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && !!formik.errors.email}
              helperText={formik.touched.email && formik.errors.email}
            />
            <Button
              onClick={() => add()}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={emails.length === 0}
      />
    </>
  );
}

export default ChplEditableJobEdit;

ChplEditableJobEdit.propTypes = {
  job: jobType.isRequired,
  dispatch: func.isRequired,
};
