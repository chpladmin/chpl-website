import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import { string } from 'prop-types';

import { useDeleteSubscriber } from 'api/subscriptions';
import { utilStyles } from 'themes';

const styles = {
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
};

// Same layout as ChplUnsubscribeAll: its heading and the result message. There
// is no card on that page, so there is no ChplSkeletonCard here either
const loadingStyles = {
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
};

function ChplUnsubscribeAllLoading() {
  return (
    <Container sx={loadingStyles.content} role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Unsubscribing</Box>
      <Skeleton variant="text" width="30%" height={56} aria-hidden="true" />
      <Skeleton variant="text" width="60%" height={24} aria-hidden="true" />
    </Container>
  );
}

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

  if (!message) { return <ChplUnsubscribeAllLoading />; }

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
