import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import { string } from 'prop-types';

import { useDeleteSubscriber } from 'api/subscriptions';

const styles = {
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
};

function ChplUnsubscribeAll(props) {
  const { hash } = props;
  const [message, setMessage] = useState(undefined);
  const deleteSubscriber = useDeleteSubscriber();

  useEffect(() => {
    deleteSubscriber.mutate({
      hash,
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
    <Container sx={styles.content}>
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
