import React, { useEffect, useState } from 'react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import {
  Card,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from 'themes/theme';
import {
  user as userPropType,
} from 'shared/prop-types';

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

function ChplCognitoUserView(props) {
  const [user, setUser] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setUser(props.user); // eslint-disable-line react/destructuring-assignment
  }, [props.user]); // eslint-disable-line react/destructuring-assignment

  return (
    <ThemeProvider theme={theme}>
      <Card
        className={classes.userCard}
        title={`${user.fullName} Information`}
      >
        <CardHeader
          title={user.fullName}
          subheader={user.friendlyName}
        />
        <CardContent className={classes.content}>
          <Typography gutterBottom>
            <strong>Email:</strong>
            <br />
            {user.email}
          </Typography>
          {user.title
                && (
                <Typography gutterBottom>
                  <strong>Title:</strong>
                  <br />
                    {user.title}
                </Typography>
                )}
          {user.phoneNumber
                && (
                <Typography gutterBottom>
                  <strong>Phone Number:</strong>
                  <br />
                    {user.phoneNumber}
                </Typography>
                )}
          <Typography gutterBottom>
            <strong>Group Name:</strong>
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
          <Typography gutterBottom>
            <strong>Status:</strong>
            <br />
            { user.status }
          </Typography>
          <Typography gutterBottom>
            <strong>Account Enabled:</strong>
            <br />
            { user.accountEnabled
              ? <CheckBoxIcon />
              : <CheckBoxOutlineBlankOutlinedIcon />}
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ChplCognitoUserView;

ChplCognitoUserView.propTypes = {
  user: userPropType.isRequired,
};
