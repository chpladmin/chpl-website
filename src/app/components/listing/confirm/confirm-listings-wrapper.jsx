import React from 'react';
import { func } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import ChplConfirmListings from './confirm-listings';

import AppWrapper from 'app-wrapper';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: 'calc(100vh - 257px)',
  },
}));
function ChplConfirmListingsWrapper(props) {
  const { onProcess } = props;
  const classes = useStyles();

  return (
    <AppWrapper>
      <div className={classes.container}>
        <ChplConfirmListings
          onProcess={onProcess}
        />
      </div>
    </AppWrapper>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  onProcess: func.isRequired,
};
