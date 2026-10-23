import React, { useContext } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress, Container, Typography,
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useSelector } from 'react-redux';
import Moment from 'react-moment';
import {
  bool,
  func,
} from 'prop-types';

import ChplUrlChecker from 'components/url-checker/url-checker';
import UrlCheckerContext from 'components/url-checker/url-checker-context';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  rwtResultsContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  rwtResultsSectionContainer: {
    marginBottom: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 500px)',
  },
  nameContainer: {
    gridColumn: '1 / 3',
  },
  nameOnlyContainer: {
    gridColumn: '1 / 4',
  },
  titleContainer: {
    gridColumn: '3 / 5',
  },
  developerContainer: {
    gridColumn: '5 / 7',
  },
  developerOnlyContainer: {
    gridColumn: '4 / 7',
  },
  urlContainer: {
    gridColumn: '1 / 6',
  },
  dateContainer: {
    gridColumn: '6 / 7',
  },
};

function ChplRwtResultsWizardSection3({ isSubmitting = false, dispatch }) {
  const user = useSelector((state) => state.userInfo.user);
  const { developer } = useContext(DeveloperContext);
  const { analytics } = useAnalyticsContext();
  const { url, setUrl } = useContext(UrlCheckerContext);

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
      event: 'Submit Service Base URL List Change Request',
    });
    dispatch(url);
  };

  return (
    <Box sx={styles.fixFooterSpacing}>
      <Container maxWidth="md">
        <Box sx={styles.rwtResultsSectionContainer}>
          <Typography gutterBottom component="h2" variant="h3">
            Section 3 &mdash; Real World Testing Results URL
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="md" sx={styles.rwtResultsContainer}>
        <Card sx={styles.fullWidthGridRow}>
          <CardContent>
            <Typography variant="body1">
              Please confirm the accessibility of your updated URL by entering the new URL and clicking Validate. If you have any issues with the validation of your URL, please reach out to your ONC-ACB for further assistance.
            </Typography>
          </CardContent>
        </Card>
        <Card sx={user.title ? styles.nameContainer : styles.nameOnlyContainer}>
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
          <Card sx={styles.titleContainer}>
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
        <Card sx={user.title ? styles.developerContainer : styles.developerOnlyContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Health IT Developer:
              </Typography>
              <Typography variant="body1">{developer.name}</Typography>
            </div>
          </CardContent>
        </Card>
        <Card sx={styles.urlContainer}>
          <CardContent>
            <ChplUrlChecker
              dispatch={handleDispatch}
            />
          </CardContent>
        </Card>
        <Card sx={styles.dateContainer}>
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
        <Box sx={styles.fullWidthGridRow}>
          <Button
            fullWidth
            id="submit-cr"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            { isSubmitting && <CircularProgress size={24} sx={styles.buttonProgress} /> }
            Submit Real World Testing Results URL Change Request
            <BorderColorIcon
              sx={styles.iconSpacing}
            />
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ChplRwtResultsWizardSection3;

ChplRwtResultsWizardSection3.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
};
