import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { number } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchReasons, usePostSubscription } from 'api/subscriptions';
import { ChplTextField } from 'components/util';

const useStyles = makeStyles({
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
  reason: yup.object()
    .required('Reason is required'),
});

function ChplSubscribe({ subscribedObjectTypeId, subscribedObjectId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [reasons, setReasons] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReasons();
  const postSubscription = usePostSubscription();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setReasons(data.sort((a, b) => (a.sortOrder - b.sortOrder)));
  }, [data, isLoading, isSuccess]);

  const subscribe = () => {
    postSubscription.mutate({
      email: formik.values.email,
      reasonId: formik.values.reason.id,
      subscribedObjectTypeId,
      subscribedObjectId,
    }, {
      onSuccess: () => {
        const body = `A confirmation email has been sent to ${formik.values.email}`;
        enqueueSnackbar(body, { variant: 'success' });
        formik.resetForm();
      },
      onError: (error) => {
        const { errorMessages } = error.response.data;
        const body = `Error: ${errorMessages.join('; ')}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      email: '',
      reason: '',
    },
    onSubmit: () => {
      subscribe();
    },
  });

  return (
    <Card>
      <CardHeader title="Subscribe for updates" />
      <ChplTextField
        id="email"
        name="email"
        label="Email"
        required
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
      />
      <ChplTextField
        select
        id="reason"
        name="reason"
        label="Reason"
        required
        value={formik.values.reason}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.reason && !!formik.errors.reason}
        helperText={formik.touched.reason && formik.errors.reason}
      >
        { reasons.map((item) => (
          <MenuItem value={item} key={item.id}>
            { item.name }
          </MenuItem>
        ))}
      </ChplTextField>
      <Button
        color="primary"
        variant="contained"
        onClick={subscribe}
        endIcon={<SendIcon />}
      >
        Subscribe
      </Button>
    </Card>
  );
}

export default ChplSubscribe;

ChplSubscribe.propTypes = {
  subscribedObjectTypeId: number.isRequired,
  subscribedObjectId: number.isRequired,
};
