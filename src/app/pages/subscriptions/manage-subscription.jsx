import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { string } from 'prop-types';

import { useFetchSubscriber, useFetchSubscriptions } from 'api/subscriptions';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
  criterionAccordion: {
    borderRadius: '8px',
    display: 'grid',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  criterionAccordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  criterionAccordionSummaryHeader: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
  },
  criterionAccordionSummarySubBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
  },
  criterionAccordionSummaryData: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  criterionAccordionDetails: {
    borderRadius: '0 0 8px 8px',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [subscriber, setSubscriber] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const subscriberQuery = useFetchSubscriber(hash);
  const subscriptionQuery = useFetchSubscriptions(hash);
  const classes = useStyles();

  useEffect(() => {
    if (subscriberQuery.isLoading || !subscriberQuery.isSuccess) {
      return;
    }
    setSubscriber(subscriberQuery.data);
  }, [subscriberQuery.data, subscriberQuery.isLoading, subscriberQuery.isSuccess]);

  useEffect(() => {
    if (subscriptionQuery.isLoading || !subscriptionQuery.isSuccess) {
      return;
    }
    setSubscriptions(subscriptionQuery.data.map((subscription) => ({
      ...subscription,
      expanded: false,
    })));
  }, [subscriptionQuery.data, subscriptionQuery.isLoading, subscriptionQuery.isSuccess]);

  const getIcon = (subscription) => (subscription.expanded
    ? (
      <>
        <Typography color="primary" variant="body2">Hide Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" className={classes.rotate} />
      </>
    )
    : (
      <>
        <Typography color="primary" variant="body2">Show Details</Typography>
        <ExpandMoreIcon color="primary" fontSize="large" />
      </>
    ));

  const handleAccordionChange = (subscription) => {
    setSubscriptions((previous) => previous.map((s) => ({
      ...s,
      expanded: s.id === subscription.id ? !s.expanded : s.expanded,
    })));
  };

  return (
    <Container className={classes.content}>
      <Typography variant="h1">
        My Subscriptions
      </Typography>
      <Typography>
        { subscriber.email }
        {' | '}
        { /* subscriber.role.name */ }
      </Typography>
      <Typography>
        { subscriptions.reduce((sum, subscription) => sum + subscription.subscriptions.length, 1) }
        {' '}
        Total Subscriptions
      </Typography>
      <Button
        disabled={selectedSubscriptions.length === 0}
      >
        Remove Selected (
        { selectedSubscriptions.length }
        )
      </Button>
      { subscriptions.map((subscription) => (
        <>
          <Accordion
            className={classes.criterionAccordion}
            onChange={() => handleAccordionChange(subscription)}
            id={`subscription-${subscription.id}`}
          >
            <AccordionSummary
              className={classes.criterionAccordionSummary}
              expandIcon={getIcon(subscription)}
              id={`subscription-id-${subscription.id}-header`}
            >
              <Box className={classes.criterionAccordionSummaryHeader}>
                <Box className={classes.criterionAccordionSummarySubBox}>
                  <Box className={classes.criterionAccordionSummaryData}>
                    <Typography>
                      chpl product number
                    </Typography>
                  </Box>
                  <Box className={classes.criterionAccordionSummaryData}>
                    <Typography variant="subtitle1">
                      n subscriptions
                    </Typography>
                  </Box>
                  <Box className={classes.criterionAccordionSummaryData}>
                    checkbox
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails
              className={classes.criterionAccordionDetails}
              id={`subscription-id-${subscription.id}-details`}
            >
              <Typography>
                Developer
                insert developer here
              </Typography>
              <Typography>
                Product
                insert product here
              </Typography>
              <Typography>
                CHPL Product Number
                insert here
              </Typography>
              <Typography>
                Verion
                insert here
              </Typography>
              { subscription.subscriptions.map((s) => (
                <>
                  <Typography>
                    insert subscription type here
                  </Typography>
                  <Button>
                    Unsubscribe
                  </Button>
                </>
              ))}
            </AccordionDetails>
          </Accordion>
        </>
      ))}
    </Container>
  );
}

export default ChplManageSubscription;

ChplManageSubscription.propTypes = {
  hash: string.isRequired,
};
