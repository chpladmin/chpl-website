import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useFetchSubscriber, useFetchSubscriptions } from 'api/subscriptions';
import {
  useDeleteSubscription,
  useFetchSubscriber,
  useFetchSubscriptions,
} from 'api/subscriptions';
import { ChplLink } from 'components/util';
import { palette, utilStyles, theme } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
    backgroundColor: `${palette.backgroundColor} !important`,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    backgroundColor: palette.background,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
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
  mySubsciptionImagery: {
    backgroundImage: `url(${Image})`,
    minHeight: '132px',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    marginLeft: '-20px',
    [theme.breakpoints.up('md')]: {
      minHeight: '175px',
    },
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSubscriptions, setSelectedSubscriptions] = useState([]);
  const [subscriber, setSubscriber] = useState(undefined);
  const [subscriptions, setSubscriptions] = useState([]);
  const { mutate } = useDeleteSubscription();
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

  const deleteSubscription = (subscription) => {
    mutate({ hash: subscriber.id, subscriptionId: subscription.id }, {
      onSuccess: () => {
        enqueueSnackbar('Subscription removed', {
          variant: 'success',
        });
      },
    });
  };

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

  if (!subscriber) { return null; }

  return (
    <Container className={classes.content}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="h1">
          My Subscriptions
        </Typography>
        <Typography>
          { subscriber.email }
          {' | '}
          { subscriber.role.name }
        </Typography>
        
      </Box>
      
      <Box className={classes.container}>
      <Card>
        <Box className={classes.mySubsciptionImagery}></Box>
        <CardContent>
        <Typography>Welcome to your subscription page!</Typography>
        <Typography>Here, you can easily view and manage your subscriptions.</Typography>
        </CardContent>
      </Card>
      <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Typography>
          { subscriptions.reduce((sum, subscription) => sum + subscription.subscriptions.length, 0) }
          {' '}
          Total Subscriptions
        </Typography>
      <Button
        disabled={selectedSubscriptions.length === 0}
        className={classes.deleteButton}
        endIcon={<DeleteIcon />}
      >
        Remove Selected (
        { selectedSubscriptions.length }
        )
      </Button>
      </Box>
      { subscriptions.map((subscription) => (
        <Accordion
          className={classes.criterionAccordion}
          onChange={() => handleAccordionChange(subscription)}
          id={`subscription-${subscription.certifiedProductId}`}
          key={`subscription-${subscription.certifiedProductId}`}
        >
          <AccordionSummary
            className={classes.criterionAccordionSummary}
            expandIcon={getIcon(subscription)}
            id={`subscription-id-${subscription.certifiedProductId}-header`}
          >
            <Box className={classes.criterionAccordionSummaryHeader}>
              <Box className={classes.criterionAccordionSummarySubBox}>
                <Box className={classes.criterionAccordionSummaryData}>
                  <Typography>
                    {subscription.chplProductNumber}
                  </Typography>
                </Box>
                <Box className={classes.criterionAccordionSummaryData}>
                  <Typography variant="subtitle1">
                    { subscription.subscriptions.length }
                    {' '}
                    subscription
                    { subscription.subscriptions.length !== 1 && 's' }
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
            id={`subscription-id-${subscription.certifiedProductId}-details`}
          >
            <Typography>
              Developer
              <ChplLink
                href={`#/organizations/developers/${subscription.developerId}`}
                text={subscription.developerName}
                external={false}
                router={{ sref: 'organizations.developers.developer', options: { id: subscription.developerId } }}
              />
            </Typography>
            <Typography>
              Product
              {subscription.productName}
            </Typography>
            <Typography>
              <ChplLink
                href={`#/listing/${subscription.certifiedProductId}`}
                text={`${subscription.chplProductNumber}`}
                external={false}
                router={{ sref: 'listing', options: { id: subscription.certifiedProductId } }}
              />
            </Typography>
            <Typography>
              Version
              {subscription.version}
            </Typography>
            { subscription.subscriptions.map((s) => (
              <Box
                key={s.id}
              >
                <Typography>
                  {s.subject.type.name}
                  {' | ' }
                  {s.subject.subject}
                </Typography>
                <Button
                  onClick={() => deleteSubscription(s)}
                  className={classes.deleteButton}
                  endIcon={<DeleteIcon />}
                >
                  Unsubscribe
                </Button>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      </Box>
      </Box>
    </Container>
  );
}

export default ChplManageSubscription;

ChplManageSubscription.propTypes = {
  hash: string.isRequired,
};
