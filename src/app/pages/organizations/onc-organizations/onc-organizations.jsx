import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import AddIcon from '@material-ui/icons/Add';
import { useSnackbar } from 'notistack';

import {
  useDeleteUserFromAcb,
  useFetchAcbs,
  useFetchUsersAtAcb,
  usePostUserInvitation,
} from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import ChplOncOrganization from 'components/onc-organization/onc-organization';
import ChplUsers from 'components/user/users';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  orgContainer: {
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
});

const sortOrgs = (a, b) => {
  if (a.retired && !b.retired) { return 1; }
  if (!a.retired && b.retired) { return -1; }
  return a.name < b.name ? -1 : 1;
};

function ChplOncOrganizations() {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [orgs, setOrgs] = useState([]);
  const [active, setActive] = useState(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState('');
  const [orgType, setOrgType] = useState('');
  const [users, setUsers] = useState([]);
  const { mutate: remove } = useDeleteUserFromAcb();
  const { mutate: invite } = usePostUserInvitation();
  const acbQuery = useFetchAcbs(true);
  const atlQuery = useFetchAtls(true);
  const userQuery = useFetchUsersAtAcb(active);
  const roles = ['ROLE_ACB'];
  const classes = useStyles();

  useEffect(() => {
    setOrgType(window.location.href.includes('onc-acbs') ? 'acb' : 'atl');
  }, []);

  useEffect(() => {
    if (orgType !== 'acb') { return; }
    if (acbQuery.isLoading || !acbQuery.isSuccess) { return; }
    setOrgs(acbQuery.data.acbs.sort(sortOrgs));
    if (acbQuery.data.acbs.length === 1) {
      setActive(acbQuery.data.acbs[0]);
    }
  }, [acbQuery.data, acbQuery.isLoading, acbQuery.isSuccess, orgType]);

  useEffect(() => {
    if (orgType !== 'atl') { return; }
    if (atlQuery.isLoading || !atlQuery.isSuccess) { return; }
    setOrgs(atlQuery.data.atls.sort(sortOrgs));
    if (atlQuery.data.atls.length === 1) {
      setActive(atlQuery.data.atls[0]);
    }
  }, [atlQuery.data, atlQuery.isLoading, atlQuery.isSuccess, orgType]);

  useEffect(() => {
    if (orgType !== 'acb') { return; }
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUsers(userQuery.data.users);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess, orgType]);

  const navigate = (target) => {
    const next = target || (orgs.length === 1 ? orgs[0] : undefined);
    setActive(next);
    setIsCreating(false);
    setIsEditing('');
    if (!next) {
      setUsers([]);
    }
  };

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        setIsEditing('');
        break;
      case 'delete':
        remove({ id: active.id, userId: payload }, {
          onSuccess: () => {
            setIsEditing('');
          },
          onError: (error) => {
            console.log({ error });
          },
        });
        break;
      case 'edit':
        if (isCreating) {
          navigate(undefined);
        } else {
          setIsEditing(payload);
        }
        break;
      case 'invite':
        invite({ role: 'ROLE_ACB', emailAddress: payload.email, permissionObjectId: active.id }, {
          onSuccess: () => {
            enqueueSnackbar(`Email sent successfully to ${payload.email}`, {
              variant: 'success',
            });
          },
          onError: () => {
            enqueueSnackbar('Email was not sent', {
              variant: 'error',
            });
          },
        });
        break;
      case 'refresh':
        setIsEditing('');
        break;
      default:
        console.log({ action, payload });
    }
  };

  return (
    <div className={orgs.length > 1 ? classes.container : classes.orgContainer}>
      { orgs.length > 1
        && (
          <div className={classes.navigation}>
            <Card>
              { orgs.map((org) => (
                <Button
                  key={org.name}
                  onClick={() => navigate(org)}
                  disabled={active?.name === org.name}
                  id={`onc-organizations-navigation-${org.name}`}
                  fullWidth
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  className={classes.menuItems}
                >
                  <Box display="flex" flexDirection="row" gridGap={4}>
                    { org.retired ? <Chip size="small" color="default" variant="outlined" label="Retired" /> : '' }
                    { org.name }
                  </Box>
                </Button>
              ))}
            </Card>
          </div>
        )}
      <Box display="flex" flexDirection="column" gridGap={16}>
        { active?.id
          && (
            <>
              { isEditing !== 'user'
                && (
                  <ChplOncOrganization
                    dispatch={handleDispatch}
                    organization={active}
                    orgType={orgType}
                  />
                )}
              { isEditing !== 'org' && orgType === 'acb'
                && (
                  <ChplUsers 
                    users={users} 
                    roles={roles} 
                    dispatch={handleDispatch} 
                    />
                )}
            </>
          )}
        { !active?.id && !isCreating
         && (
         <Card>
           <CardContent>
            <Typography>
                ONC Organization maintenance
            </Typography>
            { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
              && (
                <Button
                  onClick={() => setIsCreating(true)}
                >
                  Create
                </Button>
              )}           
           </CardContent>
           <CardActions>
             <Button
               variant="contained"
               color="primary"
               onClick={() => setIsCreating(true)}
               endIcon={<AddIcon />}
             >
               Create
             </Button>
           </CardActions>
         </Card>
         )}
        { isCreating && hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
          && (
            <ChplOncOrganization
              dispatch={handleDispatch}
              organization={{}}
              orgType={orgType}
              isCreating
            />
          )}
      </Box>
    </div>
  );
}

export default ChplOncOrganizations;

ChplOncOrganizations.propTypes = {
};
