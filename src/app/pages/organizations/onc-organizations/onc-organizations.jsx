import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Skeleton,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import { bool, oneOf } from 'prop-types';

import {
  useDeleteUserFromAcb,
  useFetchAcbs,
  useFetchUsersAtAcb,
  usePostUserInvitation,
} from 'api/acbs';
import { useFetchAtls } from 'api/atls';
import ChplOncOrganization from 'components/onc-organization/onc-organization';
import ChplUsers from 'components/user/users';
import {
  ChplLoadingSection,
  ChplPageBody,
  ChplPageHeader,
  ChplSkeletonCard,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { compareOrganizations } from 'services/sort.service';
import { AnalyticsContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    minHeight: 'calc(100vh - 247px)',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
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
};

const loadingStyles = {
  // A menu Button: its 8px padding around a line of text
  menuItem: {
    padding: '8px',
  },
  maintenance: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
};

// ONC staff see the menu of organizations beside the maintenance card. Anyone
// else usually has a single organization, which opens straight away: its card,
// and for an ONC-ACB the card of its users
function ChplOncOrganizationsLoading({ orgType, showMenu }) {
  const label = orgType === 'acb' ? 'Loading ONC-ACBs' : 'Loading ONC-ATLs';
  if (!showMenu) {
    return (
      <Box role="status" aria-live="polite">
        <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
        <Box display="flex" flexDirection="column" gap="16px" aria-hidden="true">
          <ChplLoadingSection announce={false} rows={5} />
          { orgType === 'acb'
            && <ChplLoadingSection announce={false} rows={3} />}
        </Box>
      </Box>
    );
  }
  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>{ label }</Box>
      <Box sx={styles.container} aria-hidden="true">
        <Box sx={styles.navigation}>
          <ChplSkeletonCard>
            {[...Array(6)].map((_org, idx) => (
              // eslint-disable-next-line react/no-array-index-key
              <Box key={idx} sx={loadingStyles.menuItem}>
                <Skeleton variant="text" width="70%" height={24} />
              </Box>
            ))}
          </ChplSkeletonCard>
        </Box>
        <ChplSkeletonCard sx={loadingStyles.maintenance}>
          <Skeleton variant="text" width="40%" height={24} />
          <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: '4px' }} />
        </ChplSkeletonCard>
      </Box>
    </Box>
  );
}

ChplOncOrganizationsLoading.propTypes = {
  orgType: oneOf(['acb', 'atl']).isRequired,
  showMenu: bool.isRequired,
};

const none = [];

function ChplOncOrganizations({ orgType = 'acb' }) {
  const { hasAnyRole } = useContext(UserContext);
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const [activeId, setActiveId] = useState(undefined);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState('');
  const [users, setUsers] = useState([]);
  const { mutate: remove } = useDeleteUserFromAcb();
  const { mutate: invite } = usePostUserInvitation();
  const acbQuery = useFetchAcbs(true);
  const atlQuery = useFetchAtls(true);
  const orgQuery = orgType === 'acb' ? acbQuery : atlQuery;
  const orgs = useMemo(() => {
    if (!orgQuery.data) { return none; }
    return [...(orgType === 'acb' ? orgQuery.data.acbs : orgQuery.data.atls)].sort(compareOrganizations);
  }, [orgQuery.data, orgType]);
  const userQuery = useFetchUsersAtAcb(orgs.find((org) => org.id === activeId), orgType);
  const roles = ['chpl-onc-acb'];
  let analyticsData;

  useEffect(() => {
    if (orgs.length === 1) {
      setActiveId(orgs[0].id);
    }
  }, [orgs]);

  useEffect(() => {
    if (orgType !== 'acb') { return; }
    if (userQuery.isLoading || !userQuery.isSuccess) { return; }
    setUsers(userQuery.data.users);
  }, [userQuery.data, userQuery.isLoading, userQuery.isSuccess, orgType]);

  const navigate = (target) => {
    const next = target || (orgs.length === 1 ? orgs[0] : undefined);
    setActiveId(next?.id);
    eventTrack({
      ...analyticsData.analytics,
      event: 'Navigate to Organization',
      label: target.name,
    });
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
        remove({ id: activeId, userId: payload }, {
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
        invite({ groupName: 'chpl-onc-acb', email: payload.email, organizationId: activeId }, {
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
        // no default
    }
  };

  analyticsData = {
    analytics: {
      ...analytics,
      category: orgType === 'acb' ? 'ONC-ACBs' : 'ONC-ATLs',
    },
  };

  // A single organization opens straight away, so wait for it to be selected too
  if (orgQuery.isLoading || (orgs.length === 1 && !activeId)) {
    return (
      <>
        <ChplPageHeader text={orgType === 'acb' ? 'ONC-ACBs' : 'ONC-ATLs'} />
        <ChplPageBody>
          <ChplOncOrganizationsLoading
            orgType={orgType}
            showMenu={hasAnyRole(['chpl-admin', 'chpl-onc'])}
          />
        </ChplPageBody>
      </>
    );
  }

  return (
    <>
      <ChplPageHeader text={orgType === 'acb' ? 'ONC-ACBs' : 'ONC-ATLs'} />
      <ChplPageBody>
        <AnalyticsContext.Provider value={analyticsData}>
          <Box sx={orgs.length > 1 ? styles.container : undefined}>
            { orgs.length > 1
              && (
                <Box sx={styles.navigation}>
                  <Card>
                    { orgs.map((org) => (
                      <Button
                        key={org.name}
                        onClick={() => navigate(org)}
                        disabled={orgs.find((o) => o.id === activeId)?.name === org.name}
                        id={`onc-organizations-navigation-${org.name}`}
                        fullWidth
                        variant="text"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        sx={styles.menuItems}
                      >
                        <Box display="flex" flexDirection="row" gap="4px">
                          { org.retired ? <Chip size="small" color="default" variant="outlined" label="Retired" /> : '' }
                          { org.name }
                        </Box>
                      </Button>
                    ))}
                  </Card>
                </Box>
              )}
            <Box display="flex" flexDirection="column" gap="16px">
              { activeId
                && (
                  <>
                    { isEditing !== 'user'
                      && (
                        <ChplOncOrganization
                          dispatch={handleDispatch}
                          organization={orgs.find((org) => org.id === activeId)}
                          orgType={orgType}
                        />
                      )}
                    { isEditing !== 'org' && orgType === 'acb'
                      && (
                        <ChplUsers
                          users={users}
                          groupNames={roles}
                          dispatch={handleDispatch}
                          organizationId={activeId}
                          isLoading={userQuery.isInitialLoading}
                        />
                      )}
                  </>
                )}
              { !activeId && !isCreating
                && (
                  <Card>
                    <CardContent>
                      <Typography>
                        ONC Organization maintenance
                      </Typography>
                    </CardContent>
                    { hasAnyRole(['chpl-admin', 'chpl-onc'])
                      && (
                        <CardActions>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsCreating(true)}
                            endIcon={<AddIcon />}
                            id="create-new-organization"
                          >
                            Create
                          </Button>
                        </CardActions>
                      )}
                  </Card>
                )}
              { isCreating && hasAnyRole(['chpl-admin', 'chpl-onc'])
                && (
                  <ChplOncOrganization
                    dispatch={handleDispatch}
                    organization={{}}
                    orgType={orgType}
                    isCreating
                  />
                )}
            </Box>
          </Box>
        </AnalyticsContext.Provider>
      </ChplPageBody>
    </>
  );
}

export default ChplOncOrganizations;

ChplOncOrganizations.propTypes = {
  orgType: oneOf(['acb', 'atl']),
};
