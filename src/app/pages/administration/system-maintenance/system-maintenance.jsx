import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AnnouncementOutlinedIcon from '@mui/icons-material/AnnouncementOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';
import MoreOutlinedIcon from '@mui/icons-material/MoreOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import PlaylistAddCheckOutlinedIcon from '@mui/icons-material/PlaylistAddCheckOutlined';
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet';
import SpeedOutlinedIcon from '@mui/icons-material/SpeedOutlined';
import SubscriptionsOutlinedIcon from '@mui/icons-material/SubscriptionsOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

import ChplAccessibilityStandards from 'components/system-maintenance/accessibility-standard/accessibility-standards';
import ChplAnnouncements from 'components/system-maintenance/announcement/announcements';
import ChplApiKeys from 'components/system-maintenance/api-key/api-keys';
import ChplCertificationCriteria from 'components/system-maintenance/certification-criterion/certification-criteria';
import ChplCodeSets from 'components/system-maintenance/code-set/code-sets';
import ChplConformanceMethods from 'components/system-maintenance/conformance-method/conformance-methods';
import ChplCqms from 'components/system-maintenance/cqm/cqms';
import ChplFunctionalitiesTested from 'components/system-maintenance/functionality-tested/functionalities-tested';
import ChplG1g2 from 'components/system-maintenance/g1g2/g1g2';
import ChplManageSubscriptions from 'pages/subscriptions/manage-subscriptions';
import ChplOptionalStandards from 'components/system-maintenance/optional-standard/optional-standards';
import ChplQmsStandards from 'components/system-maintenance/qms-standard/qms-standards';
import ChplStandards from 'components/system-maintenance/standard/standards';
import ChplSvaps from 'components/system-maintenance/svap/svaps';
import ChplSystemJobs from 'components/jobs/system-jobs';
import ChplToolTip from 'components/util/chpl-tooltip';
import ChplTestData from 'components/system-maintenance/test-data/test-data';
import ChplTestTools from 'components/system-maintenance/test-tool/test-tools';
import ChplUcdProcesses from 'components/system-maintenance/ucd-process/ucd-processes';
import { eventTrack } from 'services/analytics.service';
import {
  AnalyticsContext,
  FlagContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    minHeight: 'calc(100vh - 283px)',
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
    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: '115px',
    zIndex: 1,
    transition: 'width 0.3s ease',
    [theme.breakpoints.down('md')]: {
      position: 'relative',
      top: 0,
      width: '100%',
    },
  },
  navOpen: {
    width: '200px',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  navClosed: {
    width: '50px',
  },
  navigationFlex: {
    display: 'flex',
    width: '100%',
    padding: '8px',
    flexDirection: 'column',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'row',
      overflowX: 'scroll',
    },
  },
  menuItems: {
    padding: '8px',
    minWidth: 'min-content',
    justifyContent: 'space-between',
    textTransform: 'none',
    fontSize: '11.5px',
    '&.Mui-disabled': {
      color: palette.black,
      backgroundColor: palette.background,
      fontWeight: 600,
    },
  },
};

const baseItems = [{
  id: 'home',
  primary: 'Home',
  secondary: 'View all available system maintenance options',
  icon: <ChplToolTip title="System Maintenance Home"><HomeOutlined /></ChplToolTip>,
  showInList: false,
}, {
  id: 'accessibilityStandards',
  primary: 'Accessibility Standards',
  secondary: 'Add and update the Accessibility Standards available to be applied to listings',
  icon: <ChplToolTip title="Accessibility Standards"><AccessibilityNewOutlinedIcon /></ChplToolTip>,
}, {
  id: 'announcements',
  primary: 'Announcements',
  secondary: 'Create and edit announcements displayed on CHPL for public and/or logged-in users',
  icon: <ChplToolTip title="Announcements"><AnnouncementOutlinedIcon /></ChplToolTip>,
}, {
  id: 'apiKeys',
  primary: 'API Keys',
  secondary: 'View and optionally revoke existing API Keys',
  roles: ['chpl-admin', 'chpl-onc'],
  icon: <ChplToolTip title="API Keys"><CodeOutlinedIcon /></ChplToolTip>,
}, {
  id: 'certificationCriteria',
  primary: 'Certification Criteria',
  secondary: 'Table of the Certification Criteria values',
  icon: <ChplToolTip title="Certification Criteria"><BookOutlinedIcon /></ChplToolTip>,
}, {
  id: 'codeSets',
  primary: 'Code Sets',
  secondary: 'Table of Code Sets',
  icon: <ChplToolTip title="Code Sets"><SettingsEthernetIcon /></ChplToolTip>,
}, {
  id: 'conformanceMethods',
  primary: 'Conformance Methods',
  secondary: 'Table of Conformance Methods',
  icon: <ChplToolTip title="Conformance Methods"><AccountBalanceOutlinedIcon /></ChplToolTip>,
}, {
  id: 'cqms',
  primary: 'CQMs',
  secondary: 'Table of the CQM values',
  icon: <ChplToolTip title="CQMs"><SpeedOutlinedIcon /></ChplToolTip>,
}, {
  id: 'functionalitiesTested',
  primary: 'Functionalities Tested',
  secondary: 'Table of the Functionality Tested values used during testing of certification criterion functionality',
  icon: <ChplToolTip title="Functionalities Tested"><BeenhereOutlinedIcon /></ChplToolTip>,
}, {
  id: 'g1g2',
  primary: 'G1/G2 Measures',
  secondary: 'Table of G1/G2 Measures',
  icon: <ChplToolTip title="G1/G2 Measures"><AssessmentOutlinedIcon /></ChplToolTip>,
}, {
  id: 'optionalStandards',
  primary: 'Optional Standards',
  secondary: 'View Optional Standards available to be applied to listings',
  icon: <ChplToolTip title="Optional Standards"><MoreOutlinedIcon /></ChplToolTip>,
}, {
  id: 'qmsStandards',
  primary: 'QMS Standards',
  secondary: 'Add and update the QMS Standards available to be applied to listings',
  icon: <ChplToolTip title="QMS Standards"><AssignmentTurnedInOutlinedIcon /></ChplToolTip>,
}, {
  id: 'standards',
  primary: 'Standards',
  secondary: 'Add and update health IT standards used across all CHPL listings, as maintained by ONC-ACBs',
  icon: <ChplToolTip title="Standards"><PlaylistAddCheckOutlinedIcon /></ChplToolTip>,
}, {
  id: 'subscriptions',
  primary: 'Subscriptions',
  secondary: 'Search and filter CHPL subscriptions',
  roles: ['chpl-admin', 'chpl-onc'],
  icon: <ChplToolTip title="Subscriptions"><SubscriptionsOutlinedIcon /></ChplToolTip>,
}, {
  id: 'svaps',
  primary: 'SVAPs',
  secondary: 'Add and update SVAP values for use by ONC-ACBs on each listing',
  icon: <ChplToolTip title="SVAP"><TrendingUpOutlinedIcon /></ChplToolTip>,
}, {
  id: 'systemJobs',
  primary: 'System Jobs',
  secondary: 'View and schedule system-related jobs',
  roles: ['chpl-admin'],
  icon: <ChplToolTip title="System Jobs"><PlayArrowOutlinedIcon /></ChplToolTip>,
}, {
  id: 'testData',
  primary: 'Test Data',
  secondary: 'Table of Test Data',
  icon: <ChplToolTip title="Test Data"><DataUsageOutlinedIcon /></ChplToolTip>,
}, {
  id: 'testTools',
  primary: 'Test Tools',
  secondary: 'Table of the Test Tool values used during testing of certification criterion functionality',
  icon: <ChplToolTip title="Test Tools"><BuildOutlinedIcon /></ChplToolTip>,
}, {
  id: 'ucdProcesses',
  primary: 'UCD Processes',
  secondary: 'Add and update the UCD process(es) available to be applied to certification criteria',
  icon: <ChplToolTip title="UCD Processes"><TouchAppOutlinedIcon /></ChplToolTip>,
}];

function ChplSystemMaintenance() {
  const { analytics } = useAnalyticsContext();
  const { hti520270101IsOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const [active, setActive] = useState('');
  const [maintenanceItems, setMaintenanceItems] = useState(baseItems);
  const [navOpen, setNavOpen] = useState(true);
  let navigate;
  let data;

  useEffect(() => {
    if (hti520270101IsOn) {
      setMaintenanceItems(() => baseItems.filter((i) => i.id !== 'g1g2'));
    } else {
      setMaintenanceItems(baseItems);
    }
  }, [hti520270101IsOn]);

  const getNavigationItem = (item) => (
    <Button
      key={item.id}
      onClick={() => navigate(item.id)}
      disabled={active === item.id || (item.id === 'home' && (active === '' || active === 'home'))}
      id={`system-maintenance-navigation-${item.id}`}
      size="medium"
      variant="text"
      color="primary"
      endIcon={navOpen ? item.icon : null}
      sx={styles.menuItems}
    >
      { navOpen ? item.primary : item.icon }
    </Button>
  );

  navigate = (target) => {
    setActive(target);
    eventTrack({
      ...data.analytics,
      event: `Navigate to ${target}`,
    });
  };

  data = {
    analytics: {
      ...analytics,
      category: 'System Maintenance',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <Box sx={styles.container}>
        <Box sx={[styles.navigation, navOpen ? styles.navOpen : styles.navClosed]}>
          <Card sx={styles.navigationFlex}>
            <ChplToolTip title={navOpen ? 'Collapse Navigation' : 'Expand Navigation'}>
              <Button
                onClick={() => setNavOpen((prev) => !prev)}
                variant="text"
                color="primary"
                size="medium"
                sx={styles.menuItems}
              >
                { navOpen ? <MenuOpenIcon /> : <MenuIcon /> }
              </Button>
            </ChplToolTip>
            { maintenanceItems
              .filter((item) => !item.roles || hasAnyRole(item.roles))
              .map((item) => getNavigationItem(item))}
          </Card>
        </Box>
        <Box width="100%">
          { (active === '' || active === 'home')
              && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      <strong>System Maintenance is a tool for ONC administrators to add and edit system values that are maintained by ONC.</strong>
                    </Typography>
                    <Divider />
                    <List>
                      { maintenanceItems
                        .filter((item) => item.showInList !== false && (!item.roles || hasAnyRole(item.roles)))
                        .map((item, index) => (
                          <React.Fragment key={item.id}>
                            <ListItem>
                              <ListItemText sx={styles.maintenanceItemsText} primary={`${item.primary}:`} secondary={item.secondary} />
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
          { active === 'codeSets' && <ChplCodeSets /> }
          { active === 'conformanceMethods' && <ChplConformanceMethods /> }
          { active === 'cqms' && <ChplCqms /> }
          { active === 'functionalitiesTested' && <ChplFunctionalitiesTested /> }
          { active === 'g1g2' && <ChplG1g2 /> }
          { active === 'optionalStandards' && <ChplOptionalStandards /> }
          { active === 'qmsStandards' && <ChplQmsStandards /> }
          { active === 'standards' && <ChplStandards /> }
          { active === 'subscriptions' && <ChplManageSubscriptions /> }
          { active === 'svaps' && <ChplSvaps /> }
          { active === 'systemJobs' && <ChplSystemJobs /> }
          { active === 'testData' && <ChplTestData /> }
          { active === 'testTools' && <ChplTestTools /> }
          { active === 'ucdProcesses' && <ChplUcdProcesses /> }
        </Box>
      </Box>
    </AnalyticsContext.Provider>
  );
}

export default ChplSystemMaintenance;
