import React from 'react';
import { arrayOf, bool, string } from 'prop-types';
import { makeStyles } from '@material-ui/core';

import ChplComplaints from './complaints';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import {
  complaint as complaintPropType,
  listing as listingPropType,
} from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    minHeight: 'calc(100vh - 188px)',
  },
});

function ChplComplaintsWrapper(props) {
  const classes = useStyles();
  const {
    bonusQuery,
    canAdd,
    disallowedFilters,
  } = props;

  return (
    <AppWrapper>
      <BreadcrumbWrapper
        disabled={!!bonusQuery}
        title="Complaints Reporting"
      >
        <div className={classes.container}>
          <ChplComplaints
            bonusQuery={bonusQuery}
            canAdd={canAdd}
            disallowedFilters={disallowedFilters}
          />
        </div>
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};

ChplComplaintsWrapper.defaultProps = {
  bonusQuery: '',
  disallowedFilters: [],
  canAdd: true,
};
