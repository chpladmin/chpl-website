import React from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplManageSubscription(props) {
  const { hash } = props;
  const classes = useStyles();

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
