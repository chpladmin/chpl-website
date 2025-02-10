import React from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { func } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { user as userPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    gap: '8px',
    overflowWrap: 'anywhere',
  },
  userCard: {
    display: 'grid',
    gridTemplateRows: '64px auto 50px',
  },
});

function ChplCognitoUserView({ user, dispatch }) {
  const classes = useStyles();

  const edit = () => {
    dispatch('edit', user);
  };

  return (
    <Card
      className={classes.userCard}
      title={`${user.fullName} Information`}
    >
      <CardHeader
        title={user.fullName}
      />
      <CardContent className={classes.content}>
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
      <CardActions className={classes.cardActions}>
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

export default ChplCognitoUserView;

ChplCognitoUserView.propTypes = {
  user: userPropType.isRequired,
  dispatch: func,
};

ChplCognitoUserView.defaultProps = {
  dispatch: () => {},
};
