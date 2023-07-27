import React from 'react';
import { string } from 'prop-types';
import {
  Box,
} from '@material-ui/core';
import ChplConfirmSubscription from './confirm-subscription';
import AppWrapper from 'app-wrapper';

function ChplConfirmSubscriptionWrapper({ hash }) {
  return (
    <AppWrapper>
      <Box sx={{ backgroundColor: '#f9f9f9'}}>
      <ChplConfirmSubscription
        hash={hash}
      />
      </Box>
    </AppWrapper>
  );
}

export default ChplConfirmSubscriptionWrapper;

ChplConfirmSubscriptionWrapper.propTypes = {
  hash: string.isRequired,
};
