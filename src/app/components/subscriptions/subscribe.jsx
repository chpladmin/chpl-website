import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import SubscriptionsTwoToneIcon from '@material-ui/icons/SubscriptionsTwoTone';
import { number } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { usePostSubscription } from 'api/subscriptions';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { ListingContext, UserContext } from 'shared/contexts';

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
});

function ChplSubscribe({ subscribedObjectTypeId, subscribedObjectId }) {
  const { enqueueSnackbar } = useSnackbar();
  const postSubscription = usePostSubscription();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { listing } = useContext(ListingContext);
  const { user } = useContext(UserContext);
  let formik;

  const subscribe = () => {
    setIsSubscribing(true);
    eventTrack({
      event: 'Subscribe to Listing',
      category: 'Listing Details',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
      group: user?.role,
    });
    postSubscription.mutate({
      email: formik.values.email,
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
        setIsSubscribing(false);
      },
      onError: (error) => {
        const { errorMessages } = error.response.data;
        const body = `Error: ${errorMessages.join('; ')}`;
        enqueueSnackbar(body, { variant: 'error' });
        setIsSubscribing(false);
      },
    });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      email: '',
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
            Keep up-to-date with significant changes to this Listing on the CHPL
          </Typography>
          <ChplTextField
            id="email"
            name="email"
            label="Enter Email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={subscribe}
            endIcon={<SendIcon fontSize="small" />}
            disabled={isSubscribing || !formik.values.email}
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
