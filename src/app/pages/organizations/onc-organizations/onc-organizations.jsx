import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {
  useDeleteUserFromAcb,
  useFetchAcbs,
  useFetchUsersAtAcb,
} from 'api/acbs';
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
  acbContainer: {
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

const sortAcbs = (a, b) => {
  if (a.retired && !b.retired) { return 1; }
  if (!a.retired && b.retired) { return -1; }
  return a.name < b.name ? -1 : 1;
};

function ChplOncOrganizations() {
  const { hasAnyRole } = useContext(UserContext);
  const [acbs, setAcbs] = useState([]);
  const [active, setActive] = useState(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState('');
  const [users, setUsers] = useState([]);
  const { mutate: remove } = useDeleteUserFromAcb();
  const { data, isLoading, isSuccess } = useFetchAcbs(true);
  const userQuery = useFetchUsersAtAcb(active);
  const roles = ['ROLE_ACB'];
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setAcbs(data.acbs.sort(sortAcbs));
    if (data.acbs.length === 1) {
      setActive(data.acbs[0]);
    }
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUsers(userQuery.data.users);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess]);

  const navigate = (target) => {
    const next = target || (acbs.length === 1 ? acbs[0] : undefined);
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
        console.error('todo: set up invitation');
        setIsEditing('');
        break;
      case 'refresh':
        setIsEditing('');
        break;
      default:
        console.log({ action, payload });
    }
  };

  return (
    <div className={acbs.length > 1 ? classes.container : classes.acbContainer}>
      { acbs.length > 1
        && (
          <div className={classes.navigation}>
            <Card>
              { acbs.map((acb) => (
                <Button
                  key={acb.name}
                  onClick={() => navigate(acb)}
                  disabled={active?.name === acb.name}
                  id={`onc-organizations-navigation-${acb.name}`}
                  fullWidth
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  className={classes.menuItems}
                >
                  <Box display="flex" flexDirection="row" gridGap={4}>
                    { acb.retired ? <Chip size="small" color="default" variant="outlined" label="Retired" /> : '' }
                    { acb.name }
                  </Box>
                </Button>
              ))}
            </Card>
          </div>
        )}
      <div>
        { active?.id
          && (
            <>
              { isEditing !== 'user'
                && (
                  <ChplOncOrganization dispatch={handleDispatch} organization={active} />
                )}
              { isEditing !== 'acb'
                && (
                  <ChplUsers users={users} roles={roles} dispatch={handleDispatch} />
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
             <Button
               onClick={() => setIsCreating(true)}
             >
               Create
             </Button>
           </CardContent>
         </Card>
         )}
        { isCreating && hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
          && (
            <ChplOncOrganization dispatch={handleDispatch} organization={{}} isCreating />
          )}
      </div>
    </div>
  );
}

export default ChplOncOrganizations;

ChplOncOrganizations.propTypes = {
};
