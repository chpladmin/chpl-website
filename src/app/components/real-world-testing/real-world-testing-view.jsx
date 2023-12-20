import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFetchRealWorldTestingPlans, useFetchRealWorldTestingResults } from 'api/developer';
import { ChplLink } from 'components/util';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplRealWorldTestingView({ developer }) {
  const [plans, setPlans] = useState([]);
  const [results, setResults] = useState([]);
  const plansQuery = useFetchRealWorldTestingPlans({ developer });
  const resultsQuery = useFetchRealWorldTestingResults({ developer });
  const classes = useStyles();

  useEffect(() => {
    if (plansQuery.isLoading || !plansQuery.isSuccess) { return; }
    setPlans(plansQuery.data);
  }, [plansQuery.data, plansQuery.isLoading, plansQuery.isSuccess]);

  useEffect(() => {
    if (resultsQuery.isLoading || !resultsQuery.isSuccess) { return; }
    setResults(resultsQuery.data);
  }, [resultsQuery.data, resultsQuery.isLoading, resultsQuery.isSuccess]);

  return (
    <>
      <Card>
        <CardHeader title="Real World Testing" />
        <CardContent className={classes.content}>
          <>
            { plans.length > 0
              && (
                <>
                  <Typography variant="subtitle1">
                    {`RWT Plans URL${plans.length !== 1 ? 's' : ''}`}
                  </Typography>
                  <List dense>
                    { plans.map((item) => (
                      <ListItem key={item.url}>
                        <ChplLink href={item.url} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            { results.length > 0
              && (
                <>
                  <Typography variant="subtitle1">
                    {`RWT Results URL${results.length !== 1 ? 's' : ''}`}
                  </Typography>
                  <List dense>
                    { results.map((item) => (
                      <ListItem key={item.url}>
                        <ChplLink href={item.url} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            { results.length === 0 && plans.length === 0
              && (
                <Typography>
                  No Real World Testing data is available
                </Typography>
              )}
          </>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplRealWorldTestingView;

ChplRealWorldTestingView.propTypes = {
  developer: developerPropType.isRequired,
};
