import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { job as jobType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '2fr 4fr',
    paddingTop: '16px',
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
  subContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
  },
  divSpacing: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'center',
  },
  cardGap: {
    gap: '16px',
    display: 'flex',
    flexDirection: 'column',
  },
  iconSpacing: {
    marginLeft: '4px',
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
  let formik;

  useEffect(() => {
    setJob(props.job);
    setEmails(props.job.jobDataMap.email.split(','));
  }, [props.job]); // eslint-disable-line react/destructuring-assignment

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
          titleTypographyProps={{ variant: 'h5' }}
          title={`Edit Job: ${job.name}`}
        />
      </Card>
      <div className={classes.container}>
        <Card>
          <CardContent className={classes.subContainer}>
            <div className={classes.subContainer}>
              <div>
                <Typography variant="subtitle1">
                  Job Name
                </Typography>
                <Typography variant="body1">
                  { job.name }
                </Typography>
              </div>
              <div>
                <Typography variant="subtitle1">
                  Job Description
                </Typography>
                <Typography variant="body1">
                  { job.description }
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className={classes.cardGap}>
          <Card>
            <CardContent>
              <div>
                <Typography gutterBottom variant="subtitle1">
                  Manage Subscribers
                </Typography>
                <div>
                  { emails.map((item) => (
                    <div className={classes.divSpacing} key={item}>
                      <div>
                        {item}
                      </div>
                      <div>
                        <IconButton
                          onClick={() => remove(item)}
                          color="default"
                        >
                          <DeleteIcon color="error" />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div>
                <Typography gutterBottom variant="subtitle1">
                  Add Subscribers
                </Typography>
                <div className={classes.divSpacing}>
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
                    <AddIcon className={classes.iconSpacing} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
