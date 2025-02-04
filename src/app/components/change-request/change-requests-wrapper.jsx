import React from 'react';
import { arrayOf, string } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import ChplChangeRequests from './change-requests';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

const useStyles = makeStyles(() => ({
  container: {
    minHeight: 'calc(100vh - 268px)',
  },
}));

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters,
    bonusQuery,
  } = props;

  const classes = useStyles();

  return (
    <AppWrapper>
      <BreadcrumbWrapper
        disabled={!!bonusQuery}
        title="Change Requests"
      >
        <div className={classes.container}>
          <ChplChangeRequests
            disallowedFilters={disallowedFilters}
            bonusQuery={bonusQuery}
          />
        </div>
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  bonusQuery: string,
};

ChplChangeRequestsWrapper.defaultProps = {
  disallowedFilters: [],
  bonusQuery: '',
};
