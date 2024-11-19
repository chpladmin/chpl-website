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
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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
import { BreadcrumbContext, UserContext } from 'shared/contexts';
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
      gridTemplateColumns: '.5fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    width: '232px',
    position: 'sticky',
    top: '115px',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      position: 'relative',
      top: 0,
    },
  },
  navigationFlex: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
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

function ChplSystemMaintenance() {
  const { hasAnyRole } = useContext(UserContext);
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [active, setActive] = useState('');
  const classes = useStyles();
  let navigate;

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
    if (target) {
      display('system-maintenance');
      hide('system-maintenance.disabled');
    } else {
      display('system-maintenance.disabled');
      hide('system-maintenance');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <Card className={classes.navigationFlex}>
          <Button
            onClick={() => navigate('accessibilityStandards')}
            disabled={active === 'accessibilityStandards'}
            id="system-maintenance-navigation-accessibility-standards"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Accessibility Standards
          </Button>
          <Button
            onClick={() => navigate('announcements')}
            disabled={active === 'announcements'}
            id="system-maintenance-navigation-announcements"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Announcements
          </Button>
          <Button
            onClick={() => navigate('apiKeys')}
            disabled={active === 'apiKeys'}
            id="system-maintenance-navigation-api-keys"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            API Keys
          </Button>
          { hasAnyRole(['chpl-admin'])
            && (
              <Button
                onClick={() => navigate('certificationCriteria')}
                disabled={active === 'certificationCriteria'}
                id="system-maintenance-navigation-certification-criteria"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                className={classes.menuItems}
              >
                Certification Criteria
              </Button>
            )}
          { hasAnyRole(['chpl-admin'])
            && (
              <Button
                onClick={() => navigate('functionalitiesTested')}
                disabled={active === 'functionalitiesTested'}
                id="system-maintenance-navigation-functionalities-tested"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                className={classes.menuItems}
              >
                Functionalities Tested
              </Button>
            )}
          <Button
            onClick={() => navigate('qmsStandards')}
            disabled={active === 'qmsStandards'}
            id="system-maintenance-navigation-qms-standards"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            QMS Standards
          </Button>
          { hasAnyRole(['chpl-admin'])
            && (
              <Button
                onClick={() => navigate('standards')}
                disabled={active === 'standards'}
                id="system-maintenance-navigation-standards"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                className={classes.menuItems}
              >
                Standards
              </Button>
            )}
          <Button
            onClick={() => navigate('subscriptions')}
            disabled={active === 'subscriptions'}
            id="system-maintenance-navigation-subscriptions"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Subscriptions
          </Button>
          <Button
            onClick={() => navigate('svaps')}
            disabled={active === 'svaps'}
            id="system-maintenance-navigation-svaps"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            SVAP
          </Button>
          { hasAnyRole(['chpl-admin'])
            && (
              <Button
                onClick={() => navigate('systemJobs')}
                disabled={active === 'systemJobs'}
                id="system-maintenance-navigation-system-jobs"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                className={classes.menuItems}
              >
                System Jobs
              </Button>
            )}
          { hasAnyRole(['chpl-admin'])
            && (
              <Button
                onClick={() => navigate('testTools')}
                disabled={active === 'testTools'}
                id="system-maintenance-navigation-test-tools"
                fullWidth
                variant="text"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                className={classes.menuItems}
              >
                Test Tools
              </Button>
            )}
          <Button
            onClick={() => navigate('ucdProcesses')}
            disabled={active === 'ucdProcesses'}
            id="system-maintenance-navigation-ucd-processes"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            UCD Processes
          </Button>
        </Card>
      </div>
      <div>
        { active === ''
          && (
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  <strong>System Maintenance is a tool for ONC administrators to add and edit system values that are maintained by ONC.</strong>
                </Typography>
                <Divider />
                <List>
                  <ListItem><ListItemText primary="Accessibility Standards" secondary="Add and update the Accessibility Standards available to be applied to listings" /></ListItem>
                  <Divider component="li" />
                  <ListItem><ListItemText primary="Announcements" secondary="Create and edit announcements displayed on CHPL for public and/or logged-in users" /></ListItem>
                  <Divider component="li" />
                  <ListItem><ListItemText primary="API Keys" secondary="View and optionally revoke existing API Keys" /></ListItem>
                  <Divider component="li" />
                  { hasAnyRole(['chpl-admin']) && (
                  <>
                    <ListItem><ListItemText primary="Certification Criteria" secondary="Table of the Certification Criteria values" /></ListItem>
                    {' '}
                    <Divider component="li" />
                  </>
                  )}
                  { hasAnyRole(['chpl-admin']) && (
                  <>
                    <ListItem><ListItemText primary="Functionalities Tested" secondary="Table of the Functionality Tested values used during testing of certification criterion functionality" /></ListItem>
                    <Divider  component="li" />
                  </>
                  ) }
                  <ListItem><ListItemText primary="QMS Standards" secondary="Add and update the QMS Standards available to be applied to listings" /></ListItem>
                  <Divider component="li" />
                  { hasAnyRole(['chpl-admin']) && (
                  <>
                    <ListItem><ListItemText primary="Standards" secondary="Add and update health IT standards used across all CHPL listings, as maintained by ONC-ACBs" /></ListItem>
                    {' '}
                    <Divider component="li" />
                  </>
                  ) }
                  <ListItem><ListItemText primary="Subscriptions" secondary="Search and filter CHPL subscriptions" /></ListItem>
                  <Divider component="li" />
                  <ListItem><ListItemText primary="SVAP" secondary="Add and update SVAP values for use by ONC-ACBs on each listing" /></ListItem>
                  <Divider component="li" />
                  { hasAnyRole(['chpl-admin']) && (
                  <>
                    <ListItem><ListItemText primary="System Jobs" secondary="View and schedule system-related jobs" /></ListItem>
                    {' '}
                    <Divider  component="li" />
                  </>
                  ) }
                  { hasAnyRole(['chpl-admin']) && (
                  <>
                    <ListItem><ListItemText primary="Test Tools" secondary="Table of the Test Tool values used during testing of certification criterion functionality" /></ListItem>
                    {' '}
                    <Divider  component="li" />
                  </>
                  ) }
                  <ListItem><ListItemText primary="UCD Processes" secondary="Add and update the UCD process(es) available to be applied to certification criteria" /></ListItem>
                </List>
              </CardContent>
            </Card>
          )}
        <Box>
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
    </div>
  );
}

export default ChplSystemMaintenance;

ChplSystemMaintenance.propTypes = {
};
