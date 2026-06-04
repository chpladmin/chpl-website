import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { useFetchRealWorldTestingPlans, useFetchRealWorldTestingResults } from 'api/developer';
import { ChplLink } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { FlagContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplRealWorldTestingView({ developer, dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { rwtChangeRequestIsOn } = useContext(FlagContext);
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const [plans, setPlans] = useState([]);
  const [results, setResults] = useState([]);
  const plansQuery = useFetchRealWorldTestingPlans({ developer });
  const resultsQuery = useFetchRealWorldTestingResults({ developer });
  const classes = useStyles();

  useEffect(() => {
    if (plansQuery.isLoading || plansQuery.isError) { return; }
    setPlans(plansQuery.data);
  }, [plansQuery.data, plansQuery.isLoading, plansQuery.isError]);

  useEffect(() => {
    if (resultsQuery.isLoading || resultsQuery.isError) { return; }
    setResults(resultsQuery.data);
  }, [resultsQuery.data, resultsQuery.isLoading, resultsQuery.isError]);

  const createRwtResultsChangeRequest = () => {
    eventTrack({
      ...analytics,
      event: 'Submit Real World Testing Results URL',
    });
    dispatch('createRwtResults');
  };

  if (resultsQuery.isError || resultsQuery.isLoading || plansQuery.isError || plansQuery.isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardHeader title="Real World Testing" />
      <CardContent className={classes.content}>
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
        { hasAnyRole(['chpl-developer']) && hasAuthorityOn({ id: developer.id }) && rwtChangeRequestIsOn
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-rwt-results-change-request-button"
                variant="contained"
                onClick={createRwtResultsChangeRequest}
              >
                Submit RWT Results URL change
              </Button>
            </CardActions>
          )}
      </CardContent>
    </Card>
  );
}

export default ChplRealWorldTestingView;

ChplRealWorldTestingView.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
