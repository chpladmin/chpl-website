import React, { useContext, useEffect, useState } from 'react';
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

import { ChplTooltip } from 'components/util';
import { developer as developerPropType } from 'shared/prop-types';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '286px',
    gap: '8px',
  },
});

function ChplDeveloperView(props) {
  const [developer, setDeveloper] = useState({});
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const edit = () => {
    props.dispatch('edit', developer);
  };

  return (
      <Card
        title={`${developer.fullName} Information`}
      >
        <CardHeader
          title={developer.fullName}
          subheader={developer.friendlyName}
        />
        <CardContent className={classes.content}>
          <div>
            <Typography>
              {developer.email
               && (
                 <>
                   <strong>Email:</strong>
                   <br />
                   {developer.email}
                 </>
               )}
            </Typography>
            {developer.title
             && (
               <Typography>
                 <strong>Title:</strong>
                 <br />
                 {developer.title}
               </Typography>
             )}
            {developer.phoneNumber
             && (
               <Typography>
                 <strong>Phone Number:</strong>
                 <br />
                 {developer.phoneNumber}
               </Typography>
             )}
            {developer.subjectName
             && (
               <Typography>
                 <strong>Developer Name:</strong>
                 <br />
                 {developer.subjectName}
               </Typography>
             )}
            <Typography>
              {developer.role
               && (
                 <>
                   <strong>Role:</strong>
                   <br />
                   {developer.role}
                 </>
               )}
            </Typography>
            {developer.organizations?.length > 0
             && (
               <Typography>
                 <strong>
                   Organization
                   {developer.organizations.length !== 1 ? 's' : ''}
                   :
                 </strong>
                 <br />
                 {developer.organizations.map((org) => (org.name)).join('; ')}
               </Typography>
             )}
          </div>
          <div>
            <Typography>
              <strong>Last Login:</strong>
              <br />
              {developer.lastLoggedInDate ? DateUtil.timestampToString(developer.lastLoggedInDate) : 'N/A'}
            </Typography>
            <Typography>
              <strong>Account Locked:</strong>
              <br />
              {developer.accountLocked
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography>
              <strong>Account Enabled:</strong>
              <br />
              { developer.accountEnabled
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
            <Typography>
              <strong>Password change on next login:</strong>
              <br />
              { developer.passwordResetRequired
                ? <CheckBoxIcon />
                : <CheckBoxOutlineBlankOutlinedIcon />}
            </Typography>
          </div>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <ButtonGroup
            color="primary"
          >
            <ChplTooltip title={`Edit ${developer.fullName}`}>
              <Button
                variant="contained"
                aria-label={`Edit ${developer.fullName}`}
                onClick={edit}
              >
                <EditOutlinedIcon />
              </Button>
            </ChplTooltip>
            { canImpersonate
              && (
                <ChplTooltip title={`Impersonate ${developer.fullName}`}>
                  <Button
                    variant="outlined"
                    aria-label={`Impersonate ${developer.fullName}`}
                    onClick={impersonate}
                  >
                    <GroupIcon />
                  </Button>
                </ChplTooltip>
              )}
          </ButtonGroup>
        </CardActions>
      </Card>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
