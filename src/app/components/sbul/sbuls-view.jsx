import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { useFetchSbuls } from 'api/developer';
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

function ChplSbulsView({ developer, dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { sbulChangeRequestIsOn } = useContext(FlagContext);
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const [sbuls, setSbuls] = useState([]);
  const { data, isError, isLoading } = useFetchSbuls({ developer });
  const classes = useStyles();

  useEffect(() => {
    if (isError || isLoading) { return; }
    setSbuls(data.sort((a, b) => (a.url < b.url ? -1 : 1)));
  }, [data, isError, isLoading]);

  const createSbulChangeRequest = () => {
    eventTrack({
      ...analytics,
      event: 'Submit SBUL',
    });
    dispatch('createSbul');
  };

  if (isError || isLoading) {
    return <CircularProgress />;
  }

  return (
    <Card>
      <CardHeader title="Service Base URL List" />
      <CardContent className={classes.content}>
        <>
          <Typography variant="body1">
            Service Base URL List information is displayed here if a health IT developer has listings certified to (g)(10) and therefore must comply with
            {' '}
            <ChplLink
              href="https://www.healthit.gov/certification-health-it/conditions-ccg/application-programming-interfaces/"
              text="API Maintenance of Certification"
              analytics={{
                ...analytics,
                event: 'Go to API Maintenance of Certification',
              }}
              external={false}
              inline
            />
            {' '}
            requirements. For more information, please visit the
            {' '}
            <ChplLink
              href="https://onc-healthit.github.io/api-resource-guide/404-conditions-maintenance/#api-service-base-url-publication"
              text="API Resource Guide"
              analytics={{
                ...analytics,
                event: 'Go to API Resource Guide',
              }}
              external={false}
              inline
            />
            .
          </Typography>
          { sbuls.length > 0
            && (
              <Card>
                <TableContainer>
                  <Table
                    aria-label="Service Base URL List Information"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>URL</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { sbuls
                        .map((item) => (
                          <TableRow key={item.url}>
                            <TableCell>
                              <ChplLink
                                href={item.url}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            )}
        </>
      </CardContent>
      { hasAnyRole(['chpl-developer']) && hasAuthorityOn({ id: developer.id }) && sbulChangeRequestIsOn
        && (
          <CardActions>
            <Button
              color="primary"
              id="create-sbul-change-request-button"
              variant="contained"
              onClick={createSbulChangeRequest}
            >
              Submit Service Base URL List change
            </Button>
          </CardActions>
        )}
    </Card>
  );
}

export default ChplSbulsView;

ChplSbulsView.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
