import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import ChplAnnouncements from 'components/announcement/announcements';
import ChplAccessibilityStandards from 'components/standards/accessibility-standard/accessibility-standards';
import ChplCertificationCriteria from 'components/standards/certification-criteria/certification-criteria';
import ChplQmsStandards from 'components/standards/qms-standard/qms-standards';
import ChplFunctionalitiesTested from 'components/standards/functionality-tested/functionalities-tested';
import ChplTestTools from 'components/standards/test-tool/test-tools';
import ChplStandards from 'components/standards/standard/standards';
import ChplSvaps from 'components/standards/svap/svaps';
import ChplSystemJobs from 'components/jobs/system-jobs';
import ChplUcdProcesses from 'components/standards/ucd-process/ucd-processes';
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
    hide('certificationCriteria.viewall.disabled');
    hide('functionalitiesTested.viewall.disabled');
    hide('functionalitiesTested.viewall');
    hide('functionalitiesTested.add.disabled');
    hide('functionalitiesTested.edit.disabled');
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
        <Card>
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
          { hasAnyRole(['ROLE_ADMIN'])
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
                <Typography>
                  System Maintenance is a tool for ONC administrators to add and edit system values that are maintained by ONC.
                </Typography>
                <List>
                  <ListItem>Accessibility Standards - Add and update the Accessibility Standards available to be applied to listings</ListItem>
                  <ListItem>Announcements - Create and edit announcements displayed on CHPL for public and/or logged-in users</ListItem>
                  { hasAnyRole(['chpl-admin'])
                    && (
                      <ListItem>Certification Criteria - Table of the Certification Criteria values</ListItem>
                    )}
                  { hasAnyRole(['chpl-admin'])
                    && (
                      <ListItem>Functionalities Tested - Table of the Functionality Tested values used during testing of certification criterion functionality</ListItem>
                    )}
                  <ListItem>QMS Standards - Add and update the QMS Standards available to be applied to listings</ListItem>
                  { hasAnyRole(['ROLE_ADMIN'])
                    && (
                      <ListItem>Standards - Add and update health IT standards used across all CHPL listings, as maintained by ONC-ACBs</ListItem>
                    )}
                  <ListItem>SVAP - Add and update SVAP values for use by ONC-ACBs on each listing</ListItem>
                  { hasAnyRole(['chpl-admin'])
                    && (
                      <ListItem>System Jobs - View and schedule system-related jobs</ListItem>
                    )}
                  { hasAnyRole(['chpl-admin'])
                    && (
                      <ListItem>Test Tools - Table of the Test Tool values used during testing of certification criterion functionality</ListItem>
                    )}
                  <ListItem>UCD Processes - Add and update the UCD process(es) available to be applied to certification criteria</ListItem>
                </List>
              </CardContent>
            </Card>
          )}
        { active === 'announcements'
          && (
            <ChplAnnouncements />
          )}
        { active === 'accessibilityStandards'
          && (
            <ChplAccessibilityStandards />
          )}
        { active === 'certificationCriteria'
          && (
            <ChplCertificationCriteria />
          )}
        { active === 'qmsStandards'
          && (
            <ChplQmsStandards />
          )}
        { active === 'functionalitiesTested'
          && (
            <ChplFunctionalitiesTested />
          )}
        { active === 'standards'
          && (
            <ChplStandards />
          )}
        { active === 'svaps'
          && (
            <ChplSvaps />
          )}
        { active === 'systemJobs'
          && (
            <ChplSystemJobs />
          )}
        { active === 'testTools'
          && (
            <ChplTestTools />
          )}
        { active === 'ucdProcesses'
          && (
            <ChplUcdProcesses />
          )}
      </div>
    </div>
  );
}

export default ChplSystemMaintenance;

ChplSystemMaintenance.propTypes = {
};
