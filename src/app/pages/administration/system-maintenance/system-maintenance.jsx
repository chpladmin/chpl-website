import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  Typography,
  makeStyles,
  Divider,
  ListItemText,
} from '@material-ui/core';
import CodeOutlinedIcon from '@material-ui/icons/CodeOutlined';
import AnnouncementOutlinedIcon from '@material-ui/icons/AnnouncementOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import PlaylistAddCheckOutlinedIcon from '@material-ui/icons/PlaylistAddCheckOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import AccessibilityNewOutlinedIcon from '@material-ui/icons/AccessibilityNewOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import TouchAppOutlinedIcon from '@material-ui/icons/TouchAppOutlined';
import BuildOutlinedIcon from '@material-ui/icons/BuildOutlined';
import BeenhereOutlinedIcon from '@material-ui/icons/BeenhereOutlined';

import ChplAccessibilityStandards from 'components/system-maintenance/accessibility-standard/accessibility-standards';
import ChplAnnouncements from 'components/system-maintenance/announcement/announcements';
import ChplApiKeys from 'components/system-maintenance/api-key/api-keys';
import ChplCertificationCriteria from 'components/system-maintenance/certification-criteria/certification-criteria';
import ChplFunctionalitiesTested from 'components/system-maintenance/functionality-tested/functionalities-tested';
import ChplManageSubscriptions from 'pages/subscriptions/manage-subscriptions';
import ChplQmsStandards from 'components/system-maintenance/qms-standard/qms-standards';
import ChplStandards from 'components/system-maintenance/standard/standards';
import ChplSvaps from 'components/system-maintenance/svap/svaps';
import ChplSystemJobs from 'components/jobs/system-jobs';
import ChplTestTools from 'components/system-maintenance/test-tool/test-tools';
import ChplUcdProcesses from 'components/system-maintenance/ucd-process/ucd-processes';
import { eventTrack } from 'services/analytics.service';
import {
  AnalyticsContext,
  BreadcrumbContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
      alignItems: 'start',
    },
  },
  maintenanceItemsText: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    alignItems: 'baseline',
    margin: 0,
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    width: '250px',
    position: 'sticky',
    top: '115px',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      width: '100%',
      position: 'relative',
      top: 0,
    },
  },
  navigationFlex: {
    display: 'flex',
    width: '100%',
    padding: '8px',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      overflowX: 'scroll',
    },
  },
  menuItems: {
    padding: '8px',
    minWidth: 'min-content',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
});

const maintenanceItems = [{
  id: 'accessibilityStandards',
  primary: 'Accessibility Standards',
  secondary: 'Add and update the Accessibility Standards available to be applied to listings',
  icon: <AccessibilityNewOutlinedIcon />,
}, {
  id: 'announcements',
  primary: 'Announcements',
  secondary: 'Create and edit announcements displayed on CHPL for public and/or logged-in users',
  icon: <AnnouncementOutlinedIcon />,
}, {
  id: 'apiKeys',
  primary: 'API Keys',
  secondary: 'View and optionally revoke existing API Keys',
  roles: ['chpl-admin', 'chpl-onc'],
  icon: <CodeOutlinedIcon />,
}, {
  id: 'certificationCriteria',
  primary: 'Certification Criteria',
  secondary: 'Table of the Certification Criteria values',
  icon: <BookOutlinedIcon />,
}, {
  id: 'functionalitiesTested',
  primary: 'Functionalities Tested',
  secondary: 'Table of the Functionality Tested values used during testing of certification criterion functionality',
  icon: <BeenhereOutlinedIcon />,
}, {
  id: 'qmsStandards',
  primary: 'QMS Standards',
  secondary: 'Add and update the QMS Standards available to be applied to listings',
  icon: <AssessmentOutlinedIcon />,
}, {
  id: 'standards',
  primary: 'Standards',
  secondary: 'Add and update health IT standards used across all CHPL listings, as maintained by ONC-ACBs',
  icon: <PlaylistAddCheckOutlinedIcon />,
}, {
  id: 'subscriptions',
  primary: 'Subscriptions',
  secondary: 'Search and filter CHPL subscriptions',
  roles: ['chpl-admin', 'chpl-onc'],
  icon: <SubscriptionsOutlinedIcon />,
}, {
  id: 'svaps',
  primary: 'SVAP',
  secondary: 'Add and update SVAP values for use by ONC-ACBs on each listing',
  icon: <TrendingUpOutlinedIcon />,
}, {
  id: 'systemJobs',
  primary: 'System Jobs',
  secondary: 'View and schedule system-related jobs',
  roles: ['chpl-admin'],
  icon: <PlayArrowOutlinedIcon />,
}, {
  id: 'testTools',
  primary: 'Test Tools',
  secondary: 'Table of the Test Tool values used during testing of certification criterion functionality',
  icon: <BuildOutlinedIcon />,
}, {
  id: 'ucdProcesses',
  primary: 'UCD Processes',
  secondary: 'Add and update the UCD process(es) available to be applied to certification criteria',
  icon: <TouchAppOutlinedIcon />,
}];

function ChplSystemMaintenance() {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [active, setActive] = useState('');
  const classes = useStyles();
  let navigate;
  let data;

  useEffect(() => {
    append(
      <Button
        key="system-maintenance.disabled"
        depth={0}
        variant="text"
        disabled
      >
        System Maintenance
      </Button>,
    );
    append(
      <Button
        key="system-maintenance"
        depth={0}
        variant="text"
        onClick={() => navigate('')}
      >
        System Maintenance
      </Button>,
    );
    display('system-maintenance.disabled');
  }, []);

  const getNavigationItem = (item) => (
    <Button
      key={item.id}
      onClick={() => navigate(item.id)}
      disabled={active === item.id}
      id={`system-maintenance-navigation-${item.id}`}
      fullWidth
      variant="text"
      color="primary"
      endIcon={item.icon}
      className={classes.menuItems}
    >
      { item.primary }
    </Button>
  );

  navigate = (target) => {
    hide('accessibilityStandards.viewall.disabled');
    hide('accessibilityStandards.viewall');
    hide('accessibilityStandards.add.disabled');
    hide('accessibilityStandards.edit.disabled');
    hide('announcements.viewall.disabled');
    hide('announcements.viewall');
    hide('announcements.add.disabled');
    hide('announcements.edit.disabled');
    hide('apiKeys.viewall.disabled');
    hide('certificationCriteria.viewall.disabled');
    hide('functionalitiesTested.viewall.disabled');
    hide('functionalitiesTested.viewall');
    hide('functionalitiesTested.add.disabled');
    hide('functionalitiesTested.edit.disabled');
    hide('manageSubscriptions.viewall.disabled');
    hide('qmsStandards.viewall.disabled');
    hide('qmsStandards.viewall');
    hide('qmsStandards.add.disabled');
    hide('qmsStandards.edit.disabled');
    hide('standards.viewall.disabled');
    hide('standards.viewall');
    hide('standards.add.disabled');
    hide('standards.edit.disabled');
    hide('testTools.viewall.disabled');
    hide('testTools.viewall');
    hide('testTools.add.disabled');
    hide('testTools.edit.disabled');
    hide('svaps.viewall.disabled');
    hide('svaps.viewall');
    hide('svaps.add.disabled');
    hide('svaps.edit.disabled');
    hide('systemJobs.viewall.disabled');
    hide('systemJobs.viewall');
    hide('systemJobs.schedule.disabled');
    hide('ucdProcesses.viewall.disabled');
    hide('ucdProcesses.viewall');
    hide('ucdProcesses.add.disabled');
    hide('ucdProcesses.edit.disabled');
    setActive(target);
    eventTrack({
      ...data.analytics,
      event: `Navigate to ${target}`,
    });
    if (target) {
      display('system-maintenance');
      hide('system-maintenance.disabled');
    } else {
      display('system-maintenance.disabled');
      hide('system-maintenance');
    }
  };

  data = {
    analytics: {
      ...analytics,
      category: 'System Maintenance',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <div className={classes.container}>
        <div className={classes.navigation}>
          <Card className={classes.navigationFlex}>
            { maintenanceItems
              .filter((item) => !item.roles || hasAnyRole(item.roles))
              .map((item) => getNavigationItem(item))}
          </Card>
        </div>
        <Box width="100%">
          { active === ''
            && (
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    <strong>System Maintenance is a tool for ONC administrators to add and edit system values that are maintained by ONC.</strong>
                  </Typography>
                  <Divider />
                  <List>
                    { maintenanceItems
                      .filter((item) => !item.roles || hasAnyRole(item.roles))
                      .map((item, index) => (
                        <React.Fragment key={item.id}>
                          <ListItem>
                            <ListItemText className={classes.maintenanceItemsText} primary={`${item.primary}:`} secondary={item.secondary} />
                          </ListItem>
                          { index < maintenanceItems.length - 1 && <Divider component="li" /> }
                        </React.Fragment>
                      )) }
                  </List>
                </CardContent>
              </Card>
            )}
          { active === 'accessibilityStandards' && <ChplAccessibilityStandards /> }
          { active === 'announcements' && <ChplAnnouncements /> }
          { active === 'apiKeys' && <ChplApiKeys /> }
          { active === 'certificationCriteria' && <ChplCertificationCriteria /> }
          { active === 'qmsStandards' && <ChplQmsStandards /> }
          { active === 'functionalitiesTested' && <ChplFunctionalitiesTested /> }
          { active === 'subscriptions' && <ChplManageSubscriptions /> }
          { active === 'standards' && <ChplStandards /> }
          { active === 'svaps' && <ChplSvaps /> }
          { active === 'systemJobs' && <ChplSystemJobs /> }
          { active === 'testTools' && <ChplTestTools /> }
          { active === 'ucdProcesses' && <ChplUcdProcesses /> }
        </Box>
      </div>
    </AnalyticsContext.Provider>
  );
}

export default ChplSystemMaintenance;

ChplSystemMaintenance.propTypes = {
};
