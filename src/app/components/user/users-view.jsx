import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  arrayOf,
  bool,
  func,
  number,
  string,
} from 'prop-types';

import ChplUserInvite from './user-invite';
import ChplUserView from './user-view';
import ChplUserEdit from './user-edit';

import { usePutUser } from 'api/users';
import { ChplSkeletonCard, ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { compareStrings } from 'services/sort.service';
import { user as userPropType } from 'shared/prop-types';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: 'calc(100vh - 188px)',
  },
  header: {
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '.5px solid #c2c6ca',
    borderRadius: '8px',
    boxShadow: 'rgb(149 157 165 / 10%) 0px 4px 8px',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  users: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(225px, 1fr))',
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
  },
  cardHeaderAction: {
    margin: '0',
  },
};

const loadingStyles = {
  // The padding of the real card's CardHeader and CardContent
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
  },
  cardContent: {
    padding: '16px',
  },
  // The search box and invite button's row, without its own white fill
  header: {
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  search: {
    flex: 1,
    borderRadius: '4px',
  },
  button: {
    borderRadius: '4px',
  },
  // Header, details and actions of a ChplUserView card
  user: {
    borderRadius: '4px',
  },
};

// The Manage Users card while its users load: its title and count, the search
// and invite row, and a grid of user cards
function ChplUsersViewLoading() {
  return (
    <Container disableGutters maxWidth="lg">
      <Box sx={styles.container} role="status" aria-live="polite">
        <Box component="span" sx={utilStyles.visuallyHidden}>Loading users</Box>
        <ChplSkeletonCard>
          <Box aria-hidden="true">
            <Box sx={loadingStyles.cardHeader}>
              <Skeleton variant="text" width="25%" height={32} />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
            <Box sx={loadingStyles.cardContent}>
              <Box sx={loadingStyles.header}>
                <Skeleton variant="rectangular" height={56} sx={loadingStyles.search} />
                <Skeleton variant="rectangular" width={160} height={40} sx={loadingStyles.button} />
              </Box>
              <Box sx={styles.users}>
                {[...Array(6)].map((_user, idx) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Skeleton key={idx} variant="rectangular" height={280} sx={loadingStyles.user} />
                ))}
              </Box>
            </Box>
          </Box>
        </ChplSkeletonCard>
      </Box>
    </Container>
  );
}

function ChplUsersView({
  dispatch,
  groupNames,
  users: initialUsers,
  organizationId = undefined,
  isLoading = false,
}) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { mutate } = usePutUser();
  const [activeUser, setActiveUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleFilter = (event) => {
    const regex = new RegExp(event.target.value, 'i');
    if (event.target.value.length > 0) {
      eventTrack({
        ...analytics,
        event: 'Search User',
        label: event.target.value,
      });
    }
    setUsers(initialUsers
      .filter((u) => regex.test(u.fullName)
                     || regex.test(u.email)
              || regex.test(u.subjectName)));
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        setActiveUser(undefined);
        handleFilter({ target: { value: '' } });
        eventTrack({
          ...analytics,
          event: 'Cancel User Edit',
        });
        dispatch('cancel');
        break;
      case 'delete':
        setActiveUser(undefined);
        eventTrack({
          ...analytics,
          event: 'Delete User',
        });
        dispatch('delete', data);
        break;
      case 'edit':
        setActiveUser(data);
        eventTrack({
          ...analytics,
          event: 'Edit User',
        });
        dispatch('edit', 'user');
        break;
      case 'invite':
        eventTrack({
          ...analytics,
          event: 'Send Invite',
        });
        dispatch('invite', data);
        break;
      case 'save':
        mutate(data, {
          onSuccess: () => {
            setActiveUser(undefined);
            eventTrack({
              ...analytics,
              event: 'Save User',
            });
            dispatch('refresh');
          },
          onError: (error) => {
            if (error.data.error) {
              setErrors([error.data.error]);
            } else if (error.data?.errorMessages?.length > 0) {
              setErrors(error.data.errorMessages);
            }
          },
        });
        break;
        // no default
    }
  };

  const displayUser = (userToDisplay) => (
    <ChplUserView
      key={userToDisplay.cognitoId}
      user={userToDisplay}
      dispatch={handleDispatch}
    />
  );

  const displayUserEdit = (userToEdit) => (
    <ChplUserEdit
      user={userToEdit}
      errors={errors}
      dispatch={handleDispatch}
      organizationId={organizationId}
    />
  );

  if (!hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer'])) {
    return null;
  }

  if (isLoading) { return <ChplUsersViewLoading />; }

  return (
    <Container disableGutters maxWidth="lg">
      { activeUser
        && (
          displayUserEdit(activeUser)
        )}
      { !activeUser
        && (
          <Box sx={styles.container}>
            <Card>
              <CardHeader
                title="Manage Users"
                sx={{
                  '& .MuiCardHeader-action': styles.cardHeaderAction,
                }}
                action={(
                  <Typography>
                    (
                    {users.length}
                    {' '}
                    user
                    {users.length === 1 ? '' : 's'}
                    )
                  </Typography>
                )}
              />
              <CardContent>
                <Box sx={styles.header}>
                  <ChplTextField
                    id="user-filter"
                    name="userFilter"
                    label="Search by Name or Email"
                    onChange={handleFilter}
                  />
                  <ChplUserInvite
                    groupNames={groupNames}
                    dispatch={handleDispatch}
                  />
                </Box>
                <Box sx={styles.users}>
                  { [...users]
                    .sort((a, b) => compareStrings(a.fullName, b.fullName))
                    .map((u) => displayUser(u))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
    </Container>
  );
}

export default ChplUsersView;

ChplUsersView.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  groupNames: arrayOf(string).isRequired,
  organizationId: number,
  isLoading: bool,
};
