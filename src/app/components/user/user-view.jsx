import React, { useEffect, useState } from 'react';
import {
  func,
} from 'prop-types';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import GroupIcon from '@material-ui/icons/Group';
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

import { getAngularService } from '../../services/angular-react-helper';
import { ChplTooltip } from '../util';
import theme from '../../themes/theme';
import {
  user as userPropType,
} from '../../shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '286px',
    gap: '8px',
  },
}));

function ChplUserView(props) {
  /* eslint-disable react/destructuring-assignment */
  const [user, setUser] = useState({});
  const DateUtil = getAngularService('DateUtil');
  const canImpersonate = getAngularService('authService').canImpersonate(props.user);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setUser(props.user);
  }, [props.user]); // eslint-disable-line react/destructuring-assignment

  const edit = () => {
    props.dispatch('edit', user);
  };

  const impersonate = () => {
    props.dispatch('impersonate', user);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card
        title={`${user.fullName} Information`}
      >
        <CardHeader
          title={user.fullName}
          subheader={user.friendlyName}
        />
        <CardContent className={classes.content}>
          <div>
            <Typography>
              {user.email
               && (
                 <>
                   <strong>Email:</strong>
                   <br />
                   {user.email}
                 </>
               )}
            </Typography>
            {user.title
             && (
               <Typography>
                 <strong>Title:</strong>
                 <br />
                 {user.title}
               </Typography>
             )}
            {user.phoneNumber
             && (
               <Typography>
                 <strong>Phone Number:</strong>
                 <br />
                 {user.phoneNumber}
               </Typography>
             )}
            {user.subjectName
             && (
               <Typography>
                 <strong>User Name:</strong>
                 <br />
                 {user.subjectName}
               </Typography>
             )}
            <Typography>
              {user.role
               && (
                 <>
                   <strong>Role:</strong>
                   <br />
                   {user.role}
                 </>
               )}
            </Typography>
            {user.organizations?.length > 0
             && (
               <Typography>
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
            <Typography>
              <strong>Last Login:</strong>
              <br />
              {user.lastLoggedInDate ? DateUtil.timestampToString(user.lastLoggedInDate) : 'N/A'}
            </Typography>
            <Typography>
              <strong>Account Locked:</strong>
              <br />
              {user.accountLocked
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography>
              <strong>Account Enabled:</strong>
              <br />
              { user.accountEnabled
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography>
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
                    variant="outlined"
                    aria-label={`Impersonate ${user.fullName}`}
                    onClick={impersonate}
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
