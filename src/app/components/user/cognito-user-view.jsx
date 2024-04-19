import React, { useEffect, useState } from 'react';
import {
  func,
} from 'prop-types';
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

import theme from '../../themes/theme';
import {
  user as userPropType,
} from '../../shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    //display: 'grid',
    //gridTemplateColumns: '1fr',
    gap: '8px',
    overflowWrap: 'anywhere',
    //[theme.breakpoints.up('sm')]: {
    //  gridTemplateColumns: '1fr 1fr',
    //},
  },
  userCard: {
    display: 'grid',
    gridTemplateRows: '64px auto 50px',
  },
}));

function ChplCognitoUserView(props) {
  /* eslint-disable react/destructuring-assignment */
  const [user, setUser] = useState({});
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setUser(props.user);
  }, [props.user]); // eslint-disable-line react/destructuring-assignment

  const edit = () => {
    props.dispatch('edit', user);
  };

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
  dispatch: func,
};

//ChplCognitoUserView.defaultProps = {
//  dispatch: () => {},
//};