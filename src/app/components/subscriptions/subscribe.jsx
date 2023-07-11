import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { number } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import Image from '../../../assets/images/SubscribeTo.png';

import { useFetchRoles, usePostSubscription } from 'api/subscriptions';
import { ChplTextField } from 'components/util';
import { theme } from 'themes';

const useStyles = makeStyles({
  subscribeToBackground: {
    backgroundImage: `url(${Image})`,
    minHeight: '132px',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    marginLeft: '-20px',
    [theme.breakpoints.up('md')]: {
      minHeight: '175px',
    },
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
  role: yup.object()
    .required('"I\'m interested because I\'m a..." is required'),
});

function ChplSubscribe({ subscribedObjectTypeId, subscribedObjectId }) {
  const { enqueueSnackbar } = useSnackbar();
  const [roles, setRoles] = useState([]);
  const { data, isLoading, isSuccess } = useFetchRoles();
  const postSubscription = usePostSubscription();
  const classes = useStyles();
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
    onSubmit: () => {
      subscribe();
    },
  });

  return (
    <Card >
      <Box className={classes.subscribeToBackground} />
      <CardContent>
        <Box display="flex" flexDirection="column" gridGap={16}>
          <div>
            <Typography gutterBottom variant="h5">
              <strong>Want Updates?</strong>
            </Typography>
            <Typography variant='body2'>
              If you&apos;re interested in keeping up-to-date with changes to this listing from the Certified Health IT Product List (CHPL) fill out the fields below.
            </Typography>
          </div>
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
            { roles.map((item) => (
              <MenuItem value={item} key={item.id}>
                { item.name }
              </MenuItem>
            ))}
          </ChplTextField>
          <Button
            color="secondary"
            variant="contained"
            onClick={subscribe}
            endIcon={<SendIcon />}
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
