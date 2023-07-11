import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { usePutSubscriber } from 'api/subscriptions';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplConfirmSubscription(props) {
  const { hash } = props;
  const [message, setMessage] = useState(undefined);
  const putSubscriber = usePutSubscriber();
  const classes = useStyles();

  useEffect(() => {
    putSubscriber.mutate({
      subscriberId: hash,
    }, {
      onSuccess: () => {
        setMessage('Your subscription has been confirmed');
      },
      onError: (error) => {
        setMessage(error.response.data.error);
      },
    });
  }, []);

  if (!message) { return null; }

  return (
    <Container className={classes.content}>
      <Typography variant="h1">
        Confirm Subscription
      </Typography>
      <Typography>
        { message }
      </Typography>
    </Container>
  );
}

export default ChplConfirmSubscription;

ChplConfirmSubscription.propTypes = {
  hash: string.isRequired,
};
