import React, { useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Moment from 'react-moment';
import { bool, func } from 'prop-types';

import ChplUrlChecker from 'components/url-checker/url-checker';
import UrlCheckerContext from 'components/url-checker/url-checker-context';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  demographicsContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  demographicsSectionContainer: {
    marginBottom: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 500px)',
  },
  nameContainer: {
    gridColumn: '1 / 2',
  },
  nameOnlyContainer: {
    gridColumn: '1 / 3',
  },
  titleContainer: {
    gridColumn: '2 / 4',
  },
  developerContainer: {
    gridColumn: '4 / 6',
  },
  developerOnlyContainer: {
    gridColumn: '3 / 6',
  },
  dateContainer: {
    gridColumn: '6 / 7',
  },
});

function ChplDemographicsWizardSection2({ isSubmitting = false, dispatch }) {
  const { developer } = useContext(DeveloperContext);
  const { analytics } = useAnalyticsContext();
  const { user } = useContext(UserContext);
  const { url, setUrl } = useContext(UrlCheckerContext);
  const classes = useStyles();

  const isSubmitDisabled = () => (!url || url.length === 0 || isSubmitting);

  const handleDispatch = ({ action, url: submittedUrl }) => {
    switch (action) {
      case 'complete':
        setUrl(submittedUrl);
        break;
      case 'update':
        setUrl('');
        break;
        // no default
    }
  };

  const handleSubmit = () => {
    eventTrack({
      ...analytics,
      event: 'Submit Developer Demographics Change Request',
    });
    dispatch(url);
  };

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="md">
        <Box className={classes.demographicsSectionContainer}>
          <Typography gutterBottom component="h2" variant="h3">
            Section 2 &mdash; Demographics entry
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="md" className={classes.demographicsContainer}>
        <Card className={user.title ? classes.nameContainer : classes.nameOnlyContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Name:
              </Typography>
              <Typography variant="body1">{user.fullName}</Typography>
            </div>
          </CardContent>
        </Card>
        { user.title && (
          <Card className={classes.titleContainer}>
            <CardContent>
              <div>
                <Typography gutterBottom variant="subtitle1">
                  Title:
                </Typography>
                <Typography variant="body1">{user.title}</Typography>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className={user.title ? classes.developerContainer : classes.developerOnlyContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Health IT Developer:
              </Typography>
              <Typography variant="body1">{developer.name}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card className={classes.dateContainer}>
          <CardContent>
            <Typography gutterBottom variant="subtitle1">
              Date:
            </Typography>
            <Typography variant="body1">
              <Moment
                date={Date.now()}
                format="DD MMM yyyy"
              />
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.demographics}>
          <CardContent>
            fields here
          </CardContent>
        </Card>
        <Card className={classes.urlContainer}>
          <CardContent>
            <ChplUrlChecker
              dispatch={handleDispatch}
            />
          </CardContent>
        </Card>
        <div className={classes.fullWidthGridRow}>
          <Button
            fullWidth
            id="submit-cr"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            Submit Demographics Change Request
            <BorderColorIcon
              className={classes.iconSpacing}
            />
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ChplDemographicsWizardSection2;

ChplDemographicsWizardSection2.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
};
