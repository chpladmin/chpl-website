import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
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

import { ChplTextField } from 'components/util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplQuarter({
  quarter,
  year,
  dispatch,
  report,
}) {
  const classes = useStyles();

  useEffect(() => {
    console.log(report, year);
  }, [report, year]);

  return (
    <Card>
    <CardHeader title={`${quarter.name} ${year}`} />
      <CardContent>
        { quarter.description }
        { report.id &&
          (
            <>
              <Button>Edit</Button>
              <Button>Download</Button>
            </>
          )}
        { !report.id &&
          (
            <Button>Initiate</Button>
          )}
      </CardContent>
    </Card>
  );
}

export default ChplQuarter;

ChplQuarter.propTypes = {
  quarter: object.isRequired,
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
};

ChplQuarter.defaultProps = {
  report: {},
}
