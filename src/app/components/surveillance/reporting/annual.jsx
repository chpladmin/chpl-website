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

function ChplAnnual({
  year,
  dispatch,
  report,
}) {
  const classes = useStyles();

  useEffect(() => {
    console.log('annual', report, year);
  }, [report, year]);

  return (
    <Card>
    <CardHeader title={`${year} Summary`} />
      <CardContent>
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

export default ChplAnnual;

ChplAnnual.propTypes = {
  dispatch: func.isRequired,
  year: number.isRequired,
  report: object,
};

ChplAnnual.defaultProps = {
  report: {},
}
