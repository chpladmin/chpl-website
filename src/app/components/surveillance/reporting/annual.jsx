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

import ChplAnnualView from './annual-view';

import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplAnnual({
  year,
  dispatch,
  report,
}) {
  const { hasAnyRole } = useContext(UserContext);
  const [state, setState] = useState('summary');
  const classes = useStyles();

  useEffect(() => {
    console.log('annual', report, year);
  }, [report, year]);

  const handleDispatch = ({action, payload}) => {
    switch (action) {
      case 'cancel':
        setState('summary');
        dispatch({ action: 'cancel' });
        break;
      default:
        dispatch({action, payload});
    }
  };

  const viewAnnual = () => {
    setState('view');
    dispatch({ action: 'focus-annual' });
  };

  return (
    <Card>
      <CardHeader title={`${year} Summary`} />
      <CardContent>
        { state === 'view'
          && (
            <ChplAnnualView
              report={report}
              dispatch={handleDispatch}
            />
          )}
        { state === 'summary'
          && (
            <>
              { report.id &&
                (
                  <>
                    { hasAnyRole(['chpl-admin', 'chpl-onc-acb'])
                      && (
                        <Button>Edit</Button>
                      )}
                    { hasAnyRole(['chpl-admin', 'chpl-onc']) // remove admin before deployment
                      && (
                        <Button
                          onClick={viewAnnual}
                        >
                          View
                        </Button>
                      )}
                    <Button>Download</Button>
                  </>
                )}
              { !report.id &&
                (
                  <Button>Initiate</Button>
                )}
            </>
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
