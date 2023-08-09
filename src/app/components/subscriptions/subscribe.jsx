import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import SubscriptionsTwoToneIcon from '@material-ui/icons/SubscriptionsTwoTone';
import { number } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { useFetchRoles, usePostSubscription } from 'api/subscriptions';
import { ChplTextField } from 'components/util';

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
});

function ChplSubscribe({ subscribedObjectTypeId, subscribedObjectId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [roles, setRoles] = useState([]);
  const { data, isLoading, isSuccess } = useFetchRoles();
  const postSubscription = usePostSubscription();
  let formik;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setRoles(data.sort((a, b) => (a.sortOrder - b.sortOrder)));
  }, [data, isLoading, isSuccess]);

  const subscribe = () => {
    postSubscription.mutate({
      email: formik.values.email,
      roleId: formik.values.role.id,
      subscribedObjectTypeId,
      subscribedObjectId,
    }, {
      onSuccess: (response) => {
        let body;
        if (response.data.status.name === 'Pending') {
          body = `A confirmation email has been sent to ${response.data.email}`;
        } else {
          body = `Your subscription will be delivered to ${response.data.email}`;
        }
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
      role: '',
    },
  });

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" gridGap={8}>
          <Box display="flex" flexDirection="row" gridGap={8}>
            <SubscriptionsTwoToneIcon fontSize="large" color="primary" />
            <Typography variant="h5">
              <strong>Want Updates?</strong>
            </Typography>
          </Box>
          <Typography variant="body2">
            If you&apos;re interested in keeping up-to-date with changes to this Listing from the CHPL fill out the fields below.
          </Typography>
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
            id="role"
            name="role"
            label="I'm interested because I'm a..."
            required
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && !!formik.errors.role}
            helperText={formik.touched.role && formik.errors.role}
          >
            {roles.map((item) => (
              <MenuItem value={item} key={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </ChplTextField>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={subscribe}
            endIcon={<SendIcon fontSize="small" />}
          >
            Subscribe
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChplSubscribe;

ChplSubscribe.propTypes = {
  subscribedObjectTypeId: number.isRequired,
  subscribedObjectId: number.isRequired,
};
