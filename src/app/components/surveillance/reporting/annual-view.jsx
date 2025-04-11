import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';

import { ChplActionBar } from 'components/action-bar';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplAnnualView({
  dispatch,
  report,
}) {
  const classes = useStyles();

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  return (
    <>
      <Typography>
        { report.acb.name }
        {' '}
        Annual Surveillance Reporting
      </Typography>
      <Typography>
        { report.year }
      </Typography>
      <Typography>
        The titles and descriptions used in this module’s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
      </Typography>
      <Typography>
        Obstacle Summary
      </Typography>
      <Typography>
        Please list any obstacles encountered during surveillance, including those related to resources/technical capabilities, developers, and providers/end-users.
      </Typography>
      <Typography>
        { report.obstacleSummary }
      </Typography>
      <Typography>
        Priority Changes From Findings Summary
      </Typography>
      <Typography>
        { report.priorityChangesFromFindingsSummary }
      </Typography>
      <ChplActionBar
        canCancel={false}
        canClose
        canSave={false}
        dispatch={handleDispatch}
      />
    </>
  );
}

export default ChplAnnualView;

ChplAnnualView.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
