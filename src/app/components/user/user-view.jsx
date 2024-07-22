import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import GroupIcon from '@material-ui/icons/Group';
import { func } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { user as userPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '8px',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  userCard: {
    display: 'grid',
    gridTemplateRows: '64px auto 50px',
  },
});

function ChplUserView({ user: initialUser, dispatch }) {
  const DateUtil = getAngularService('DateUtil');
  const canImpersonate = getAngularService('authService').canImpersonate(initialUser);
  const [user, setUser] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const edit = () => {
    dispatch('edit', user);
  };

  const impersonate = () => {
    dispatch('impersonate', user);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        className={classes.userCard}
        title={`${user.fullName} Information`}
      >
        <CardHeader
          title={user.fullName}
        />
        <CardContent className={classes.content}>
          <div>
            <Typography gutterBottom>
              <strong>Email:</strong>
              <br />
              {user.email}
            </Typography>
            {user.phoneNumber
             && (
               <Typography gutterBottom>
                 <strong>Phone Number:</strong>
                 <br />
                 {user.phoneNumber}
               </Typography>
             )}
            {user.subjectName
             && (
               <Typography gutterBottom>
                 <strong>User Name:</strong>
                 <br />
                 {user.subjectName}
               </Typography>
             )}
            <Typography gutterBottom>
              <strong>Role:</strong>
              <br />
              {user.role}
            </Typography>
            {user.organizations?.length > 0
             && (
               <Typography gutterBottom>
                 <strong>
                   Organization
                   {user.organizations.length !== 1 ? 's' : ''}
                   :
                 </strong>
                 <br />
                 {user.organizations.map((org) => (org.name)).join('; ')}
               </Typography>
             )}
          </div>
          <div>
            <Typography gutterBottom>
              <strong>Last Login:</strong>
              <br />
              { user.lastLoggedInDate ? DateUtil.timestampToString(user.lastLoggedInDate) : 'N/A' }
            </Typography>
            <Typography gutterBottom>
              <strong>Account Locked:</strong>
              <br />
              { user.accountLocked
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography gutterBottom>
              <strong>Account Enabled:</strong>
              <br />
              { user.accountEnabled
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography gutterBottom>
              <strong>Password change on next login:</strong>
              <br />
              { user.passwordResetRequired
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
          </div>
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
            { canImpersonate
              && (
                <ChplTooltip title={`Impersonate ${user.fullName}`}>
                  <Button
                    variant="contained"
                    aria-label={`Impersonate ${user.fullName}`}
                    onClick={impersonate}
                    color="secondary"
                  >
                    <GroupIcon />
                  </Button>
                </ChplTooltip>
              )}
          </ButtonGroup>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default ChplUserView;

ChplUserView.propTypes = {
  user: userPropType.isRequired,
  dispatch: func,
};

ChplUserView.defaultProps = {
  dispatch: () => {},
};
