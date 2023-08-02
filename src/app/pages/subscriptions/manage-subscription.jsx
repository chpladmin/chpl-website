import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControlLabel,
  IconButton,
  Typography,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { string } from 'prop-types';
import { useSnackbar } from 'notistack';

import Image from '../../../assets/images/mySubsriptions.png';

import {
  useDeleteObjectSubscription,
  useDeleteSubscription,
  useFetchSubscriber,
  useFetchSubscriptions,
} from 'api/subscriptions';
import { ChplLink, ChplTooltip } from 'components/util';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  chplAccordion: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: palette.divider,
    borderWidth: '.5px',
    borderStyle: 'solid',
  },
  chplAccordionDetails: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '16px',
  },
  chplAccordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    padding: '0 4px',
    borderBottom: `.5px solid ${palette.divider}`,
  },
  chplAccordionSummaryHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    width: '100%',
    justifyContent: 'space-between',
  },
  chplAccordionSummarySubBox: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '8px',
  },
  chplAccordionSummaryData: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
  },
  chplLeftHandFormat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    width: '100%',
    backgroundColor: `${palette.background}`,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  deleteTextButton: {
    color: `${palette.error} !important`,
    textTransform: 'capitalize',
  },
  header: {
    backgroundColor: `${palette.white} !important`,
    padding: '16px 0',
    marginTop: '-8px',
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaDataRow: {
    width: '100%',
    display: 'flex',
  },
  metaDataBox: {
    width: '50%',
  },
  mySubsciptionImagery: {
    backgroundImage: `url(${Image})`,
    minHeight: '164px',
    width: '100%',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    marginTop: '-16px',
  },
  page: {
    backgroundColor: `${palette.background} !important`,
    width: '100%',
  },
  rotate: {
    transform: 'rotate(180deg)',
  },
  subscriptionTypeContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
  },
  subscriptionMetaDataContainer: {
    gridGap: '8px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionTotalContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: '16px',
    alignItems: 'center',
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [subscriber, setSubscriber] = useState(undefined);
  const [subscriptions, setSubscriptions] = useState([]);
  const { mutate: deleteSingleSubscription } = useDeleteSubscription();
  const { mutate: deleteObjectSubscription } = useDeleteObjectSubscription();
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
    deleteSingleSubscription({ hash: subscriber.id, subscriptionId: subscription.id }, {
      onSuccess: () => {
        enqueueSnackbar('Subscription removed', {
          variant: 'success',
        });
      },
    });
  };

  const deleteSubscriptions = (subscription) => {
    deleteObjectSubscription({ hash: subscriber.id, objectTypeId: 1, objectId: subscription.certifiedProductId }, {
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

  return (
    <Box className={classes.page}>
      <Box className={classes.header}>
        <Container className={classes.headerContent}>
          <Typography variant="h1">
            My Subscriptions
          </Typography>
          { subscriber
            && (
              <Typography>
                {subscriber.email}
                {' | '}
                {subscriber.role.name}
              </Typography>
            )}
        </Container>
      </Box>
      <Container>
        <Box className={classes.chplLeftHandFormat}>
          <Card>
            <Box className={classes.mySubsciptionImagery} />
            <CardContent>
              <Typography gutterBottom variant="h4" component="h2"><strong>Welcome to your subscription page!</strong></Typography>
              <Typography>Here, you can easily view and manage your subscriptions.</Typography>
            </CardContent>
          </Card>
          { subscriptions.length === 0
            && (
              <Box className={classes.subscriptionTotalContainer}>
                <Typography variant="h5" component="h3">
                  <strong>
                    You have no current subscriptions
                  </strong>
                </Typography>
              </Box>
            )}
          { subscriptions.length > 0
            && (
              <Box>
                <Box className={classes.subscriptionTotalContainer}>
                  <Typography variant="h5" component="h3">
                    <strong>
                      {subscriptions.reduce((sum, subscription) => sum + subscription.subscriptions.length, 0)}
                      {' '}
                      Total Subscriptions
                    </strong>
                  </Typography>
                </Box>
                { subscriptions.map((subscription) => (
                  <Accordion
                    className={classes.chplAccordion}
                    onChange={() => handleAccordionChange(subscription)}
                    id={`subscription-${subscription.certifiedProductId}`}
                    key={`subscription-${subscription.certifiedProductId}`}
                  >
                    <AccordionSummary
                      className={classes.chplAccordionSummary}
                      expandIcon={getIcon(subscription)}
                      id={`subscription-id-${subscription.certifiedProductId}-header`}
                    >
                      <Box className={classes.chplAccordionSummaryHeader}>
                        <Box className={classes.chplAccordionSummarySubBox}>
                          <Box className={classes.chplAccordionSummaryData}>
                            <Typography variant="subtitle1">
                              {subscription.chplProductNumber}
                            </Typography>
                          </Box>
                          <Box className={classes.chplAccordionSummaryData}>
                            <Typography variant="body1">
                              {subscription.subscriptions.length}
                              {' '}
                              subscription
                              {subscription.subscriptions.length !== 1 && 's'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className={classes.chplAccordionSummaryData}>
                          <FormControlLabel
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            control={(
                              <Button
                                variant="text"
                                className={classes.deleteTextButton}
                                onClick={() => deleteSubscriptions(subscription)}
                              >
                                Unsubscribe from listing
                              </Button>
                            )}
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      className={classes.chplAccordionDetails}
                      id={`subscription-id-${subscription.certifiedProductId}-details`}
                    >
                      <Box className={classes.subscriptionMetaDataContainer}>
                        <Box className={classes.metaDataRow}>
                          <Box className={classes.metaDataBox}>
                            <Typography variant="subtitle1">
                              Developer
                            </Typography>
                            <ChplLink
                              href={`#/organizations/developers/${subscription.developerId}`}
                              text={subscription.developerName}
                              external={false}
                              router={{ sref: 'organizations.developers.developer', options: { id: subscription.developerId } }}
                            />
                          </Box>
                          <Box className={classes.metaDataBox}>
                            <Typography variant="subtitle1">
                              Product
                            </Typography>
                            <Typography>
                              {subscription.productName}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className={classes.metaDataRow}>
                          <Box className={classes.metaDataBox}>
                            <Typography variant="subtitle1">
                              CHPL ID
                            </Typography>
                            <ChplLink
                              href={`#/listing/${subscription.certifiedProductId}`}
                              text={`${subscription.chplProductNumber}`}
                              external={false}
                              router={{ sref: 'listing', options: { id: subscription.certifiedProductId } }}
                            />
                          </Box>
                          <Box className={classes.metaDataBox}>
                            <Typography variant="subtitle1">
                              Version
                            </Typography>
                            <Typography>
                              {subscription.version}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="subtitle1">
                        Subscriptions
                      </Typography>
                      { subscription.subscriptions.map((s) => (
                        <Card
                          key={s.id}
                        >
                          <CardContent>
                            <Box
                              className={classes.subscriptionTypeContainer}
                            >
                              <Typography>
                                {s.subject.type.name}
                                {' | '}
                                {s.subject.subject}
                              </Typography>
                              <ChplTooltip title="Unsubscribe from subscription type">
                                <IconButton
                                  onClick={() => deleteSubscription(s)}
                                >
                                  <DeleteIcon className={classes.deleteTextButton} />
                                </IconButton>
                              </ChplTooltip>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
        </Box>
      </Container>
    </Box>
  );
}

export default ChplManageSubscription;

ChplManageSubscription.propTypes = {
  hash: string.isRequired,
};
