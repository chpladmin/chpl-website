import React from 'react';
import { arrayOf, object, func } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import ChplConfirmDeveloper from './confirm-developer';

import AppWrapper from 'app-wrapper';
import { developer as developerProp } from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    minHeight: 'calc(100vh - 257px)',
  },
});

function ChplConfirmDeveloperWrapper(props) {
  const classes = useStyles();
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <div className={classes.container}>
        <ChplConfirmDeveloper {...props} />
      </div>
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplConfirmDeveloperWrapper;

ChplConfirmDeveloperWrapper.propTypes = {
  developer: developerProp.isRequired,
  developers: arrayOf(developerProp).isRequired,
  dispatch: func.isRequired,
  listing: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
