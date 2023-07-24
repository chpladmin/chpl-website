import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { useFetchSubscriptions } from 'api/subscriptions';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
  const [roles, setRoles] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const { data, isLoading, isSuccess } = useFetchSubscriptions(hash);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setSubscriptions(data);
  }, [data, isLoading, isSuccess]);

  return (
    <Container className={classes.content}>
      <Typography variant="h1">
        Manage Subscriptions
      </Typography>
      <Typography>
        Content coming soon
      </Typography>
    </Container>
  );
}

export default ChplManageSubscription;

ChplManageSubscription.propTypes = {
  hash: string.isRequired,
};
