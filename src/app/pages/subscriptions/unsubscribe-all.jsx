import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { useDeleteSubscriber } from 'api/subscriptions';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplUnsubscribeAll(props) {
  const { hash } = props;
  const [message, setMessage] = useState(undefined);
  const deleteSubscriber = useDeleteSubscriber();
  const classes = useStyles();

  useEffect(() => {
    deleteSubscriber.mutate({
      subscriberId: hash,
    }, {
      onSuccess: () => {
        setMessage('You have been unsubscribed from all CHPL notifications');
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
        Unsubscribe
      </Typography>
      <Typography>
        { message }
      </Typography>
    </Container>
  );
}

export default ChplUnsubscribeAll;

ChplUnsubscribeAll.propTypes = {
  hash: string.isRequired,
};
