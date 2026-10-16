import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { func } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { user as userPropType } from 'shared/prop-types';

const styles = {
  content: {
    gap: '8px',
    overflowWrap: 'anywhere',
  },
  userCard: {
    display: 'grid',
    gridTemplateRows: '64px auto 50px',
  },
};

function ChplUserView({ user, dispatch = () => {} }) {
  const edit = () => {
    dispatch('edit', user);
  };

  return (
    <Card
      sx={styles.userCard}
      title={`${user.fullName} Information`}
    >
      <CardHeader
        title={user.fullName}
      />
      <CardContent sx={styles.content}>
        <Typography gutterBottom>
          <strong>Email:</strong>
          <br />
          { user.email }
        </Typography>
        <Typography gutterBottom>
          <strong>Group Name:</strong>
          <br />
          { user.role }
        </Typography>
        { user.organizations?.length > 0
          && (
            <Typography gutterBottom>
              <strong>
                Organization
                {user.organizations.length !== 1 ? 's' : ''}
                :
              </strong>
              <br />
              { user.organizations.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensistivity: 'base' })).map((org) => (org.name)).join('; ') }
            </Typography>
          )}
        <Typography gutterBottom>
          <strong>Status:</strong>
          <br />
          { user.status }
        </Typography>
      </CardContent>
      <CardActions sx={styles.cardActions}>
        <ButtonGroup
          color="primary"
        >
          <ChplTooltip title={`Edit ${user.fullName}`}>
            <Button
              variant="contained"
              aria-label={`Edit ${user.fullName}`}
              onClick={edit}
            >
              <EditOutlinedIcon />
            </Button>
          </ChplTooltip>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}

export default ChplUserView;

ChplUserView.propTypes = {
  user: userPropType.isRequired,
  dispatch: func,
};
