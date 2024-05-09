import React, { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchDevelopersBySearch, usePostMessage } from 'api/developer';
import { useFilterContext } from 'components/filter';
import { ChplTextField } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
});

const validationSchema = yup.object({
  subject: yup.string()
    .required('Subject is required'),
  body: yup.string()
    .required('Message body is required'),
});

function ChplMessaging({ dispatch }) {
  const { queryParams, queryString } = useFilterContext(); // use "POST" values instead of query string
  const [recordCount, setRecordCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const postMessage = usePostMessage();
  const classes = useStyles();

  let formik;

  const { data, isError, isLoading } = useFetchDevelopersBySearch({
    orderBy: 'developer',
    pageNumber: 0,
    pageSize: 25,
    sortDescending: false,
    query: queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      return;
    }
    if (isLoading || !data.results) { return; }
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  const sendMessage = () => {
    postMessage.mutate({
      subject: formik.values.subject,
      body: formik.values.body,
      params: queryParams(),
    }, {
      onSuccess: (response) => {
        console.debug({ response });
        enqueueSnackbar('Message queued', { variant: 'success' });
        dispatch();
      },
      onError: (error) => {
        console.debug({ error });
        const body = 'An error occurred';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      subject: '',
      body: '',
    },
    onSubmit: () => {
      sendMessage();
    },
  });

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">
          Messaging
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        Messaging
        {' '}
        { recordCount }
        {' '}
        developers
        <ChplTextField
          id="subject"
          name="subject"
          label="Subject"
          required
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject && !!formik.errors.subject}
          helperText={formik.touched.subject && formik.errors.subject}
        />
        <ChplTextField
          id="body"
          name="body"
          label="Message Body"
          margin="none"
          required
          multiline
          value={formik.values.body}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.body && !!formik.errors.body}
          helperText={formik.touched.body && formik.errors.body}
          minRows={4}
        />
        <Button
          onClick={formik.handleSubmit}
          disabled={!formik.isValid}
        >
          Send Message
        </Button>
      </div>
    </>
  );
}

export default ChplMessaging;

ChplMessaging.propTypes = {
  dispatch: func.isRequired,
};
