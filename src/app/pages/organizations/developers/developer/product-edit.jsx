import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  makeStyles,
} from '@material-ui/core';
import { func, object } from 'prop-types';

import { usePutProduct } from 'api/product';
import ChplProduct from 'components/product/product';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

const useStyles = makeStyles({
  pageContainer: {
    padding: '32px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
});

function ChplEditProduct({ dispatch, product }) {
  const { analytics } = useAnalyticsContext();
  const { mutate } = usePutProduct();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Save Product',
        });
        setErrorMessages([]);
        mutate({
          product: payload,
          productIds: [payload.id],
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            dispatch('cancel');
          },
          onError: (error) => {
            setIsProcessing(false);
            if (error?.response?.data?.error) {
              setErrorMessages([error.response.data.error]);
            } else if (error?.response?.data?.errorMessages) {
              setErrorMessages(error.response.data.errorMessages);
            }
          },
        });
        break;
        // no default
    }
  };

  if (!product) { return <CircularProgress />; }

  return (
    <Container disableGutters maxWidth="lg">
      <Box className={classes.pageContainer}>
        <ChplProduct
          dispatch={handleDispatch}
          product={product}
          isEditing
          isProcessing={isProcessing}
          errorMessages={errorMessages}
        />
      </Box>
    </Container>
  );
}

export default ChplEditProduct;

ChplEditProduct.propTypes = {
  dispatch: func.isRequired,
  product: object.isRequired,
};
