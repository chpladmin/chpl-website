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
import {
  bool,
  func,
} from 'prop-types';

import ChplUrlChecker from 'components/url-checker/url-checker';
import UrlCheckerContext from 'components/url-checker/url-checker-context';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  sbulContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  sbulSectionContainer: {
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
});

function ChplSbulWizardSection3({ isSubmitting = false, dispatch }) {
  const { developer } = useContext(DeveloperContext);
  const { analytics } = useAnalyticsContext();
  const { user } = useContext(UserContext);
  const { url, setUrl } = useContext(UrlCheckerContext);
  const classes = useStyles();

  const isSubmitDisabled = () => (!url || url.length === 0 || isSubmitting);

  const handleDispatch = ({ action, url: submittedUrl }) => {
    switch (action) {
      case 'loading':
        setUrl('');
        break;
      case 'complete':
        setUrl(submittedUrl);
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
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="md">
        <Box className={classes.sbulSectionContainer}>
          <Typography gutterBottom component="h2" variant="h3">
            Section 3 &mdash; Service Base URL List entry
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="md" className={classes.sbulContainer}>
        <Card className={classes.fullWidthGridRow}>
          <CardContent>
            <Typography variant="body1">
              Please confirm the accessibility of your updated URL by entering the new URL and clicking Validate. If you have any issues with the validation of your URL, please reach out to your ONC-ACB for further assistance.
            </Typography>
          </CardContent>
        </Card>
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
        <Card className={classes.urlContainer}>
          <CardContent>
            <ChplUrlChecker
              dispatch={handleDispatch}
            />
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
        <div className={classes.fullWidthGridRow}>
          <Button
            fullWidth
            id="submit-cr"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >
            Submit Service Base URL List Change Request
            <BorderColorIcon
              className={classes.iconSpacing}
            />
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default ChplSbulWizardSection3;

ChplSbulWizardSection3.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
};
