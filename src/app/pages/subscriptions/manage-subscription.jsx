import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { useFetchSubscriber, useFetchSubscriptions } from 'api/subscriptions';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
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
    setSubscriptions(subscriptionQuery.data);
  }, [subscriptionQuery.data, subscriptionQuery.isLoading, subscriptionQuery.isSuccess]);

  return (
    <Container className={classes.content}>
      <Typography variant="h1">
        Manage Subscriptions
      </Typography>
      <Typography>
        { subscriber.email }
        {' | '}
        { subscriber.role.name }
      </Typography>
      { subscriptions.map((subscription) => (
        <>
          { subscription.subject.type.name }
          { subscription.subject.subject }
        </>
      ))}
    </Container>
  );
}

export default ChplManageSubscription;

ChplManageSubscription.propTypes = {
  hash: string.isRequired,
};
