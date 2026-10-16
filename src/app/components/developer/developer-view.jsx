import React, { useContext } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import { bool, func } from 'prop-types';
import BlockIcon from '@mui/icons-material/Block';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ChplOrganizationActivity from 'components/activity/organization-activity';
import { compareDeveloper } from 'components/activity/services/developers.service';
import { ChplLink, ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import {
  DeveloperContext,
  FlagContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const styles = {
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  developerHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  developerHeaderContainer: {
    maxWidth: '75%',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    margin: 0,
  },
  historyContent: {
    display: 'grid',
    padding: '4px',
  },
  statusHistorySummary: {
    backgroundColor: palette.white,
    boxShadow: 'none',
    borderRadius: '8px',
  },
  statusHistory: {
    boxShadow: 'none',
    borderRadius: '8px',
    border: `.5px solid ${palette.divider}`,
    fontWeight: 'bold',
    marginTop: '8px',
    '&:before': {
      backgroundColor: 'transparent',
    },
  },
};

const isActive = (statuses) => !statuses || statuses.length === 0 || statuses.every((status) => status.endDate);

const getStatusData = (statuses) => {
  const current = statuses
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))[0];
  if (current.endDate) { return undefined; }
  const rest = statuses
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return (
    <Box sx={styles.fullWidth}>
      <Typography variant="body1" gutterBottom>
        <strong>Status</strong>
        <br />
        {current.status.name}
        {' '}
        as of
        {' '}
        {getDisplayDateFormat(current.startDate)}
        {current.reason
          && (
            <>
              <br />
              {current.reason}
            </>
          )}
      </Typography>
      {rest.length > 0
        && (
          <Accordion
            sx={styles.statusHistory}
          >
            <AccordionSummary
              sx={styles.statusHistorySummary}
              expandIcon={<ExpandMoreIcon color="primary" />}
            >
              Status History
            </AccordionSummary>
            <AccordionDetails
              sx={styles.historyContent}
            >
              {rest.map((status, idx) => (
                <Timeline
                  key={status.id}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      { (idx !== statuses.length - 1) && <TimelineConnector /> }
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body1"
                      >
                        <strong>Status</strong>
                        <br />
                        {status.status.name === 'Suspended by ONC'
                         && (
                           <>
                             <ErrorIcon color="error" />
                             {' '}
                           </>
                         )}
                        {status.status.name === 'Under certification ban by ONC'
                         && (
                           <>
                             <BlockIcon color="error" />
                             {' '}
                           </>
                         )}
                        {status.status.name}
                        {' '}
                        as of
                        {' '}
                        {getDisplayDateFormat(status.startDate)}
                        { status.endDate
                          && (
                            <>
                              {' '}
                              ended
                              {' '}
                              {getDisplayDateFormat(status.endDate)}
                            </>
                          )}
                        .
                        {' '}
                        {status.reason
                         && (
                           <>
                             {status.reason}
                           </>
                         )}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
    </Box>
  );
};

function ChplDeveloperView(props) {
  const {
    canEdit,
    canJoin,
    canSplit,
    dispatch,
    isSplitting,
  } = props;
  const { demographicChangeRequestIsOn } = useContext(FlagContext);
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);

  const can = (action) => {
    if (action === 'edit') {
      return canEdit && !isSplitting
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && isActive(developer.statuses)) // allowed for ACB iff Developer is "Active"
            || (hasAnyRole(['chpl-developer']) && isActive(developer.statuses) && demographicChangeRequestIsOn && hasAuthorityOn(developer))); // allowed for DEVELOPER iff Developer is "Active" & CRs can be submitted
    }
    if (action === 'join') {
      return canJoin && !isSplitting
        && hasAnyRole(['chpl-admin', 'chpl-onc']); // always allowed as ADMIN/ONC
    }
    if (action === 'split') {
      return canSplit && !isSplitting
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && isActive(developer.statuses))); // allowed for ACB iff Developer is "Active"
    }
    return false;
  };

  const edit = () => {
    eventTrack({
      ...analytics,
      event: 'Edit Demographics',
    });
    dispatch('edit');
  };

  const join = () => {
    eventTrack({
      ...analytics,
      event: 'Join Developers',
    });
    dispatch('join');
  };

  const split = () => {
    eventTrack({
      ...analytics,
      event: 'Split Developer',
    });
    dispatch('split');
  };

  const createDemographicsCr = () => {
    eventTrack({
      ...analytics,
      event: 'Create Demographics CR',
    });
    dispatch('createDemographics');
  };

  return (
    <Card
      title={`${developer.name} Information`}
    >
      <CardHeader
        title={(
          <Box sx={styles.headerContainer}>
            <Box sx={styles.developerHeaderContainer}>{isSplitting ? 'Original Developer' : developer.name}</Box>
            { can('edit') && !hasAnyRole(['chpl-developer'])
              && (
                <ChplOrganizationActivity
                  organization={developer}
                  type="developers"
                  interpret={compareDeveloper}
                />
              )}
          </Box>
        )}
        component="div"
        sx={styles.developerHeader}
      />
      <CardContent sx={styles.content}>
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Developer code</strong>
            <br />
            {developer.developerCode}
          </Typography>
          <br />
          {developer.contact
            && (
              <Typography variant="body1" gutterBottom>
                <strong>Contact</strong>
                <br />
                <Box component="span" sx={utilStyles.srOnly}>Full name: </Box>
                {developer.contact.fullName}
                {developer.contact.title
                  && (
                    <>
                      ,
                      {' '}
                      <Box component="span" sx={utilStyles.srOnly}>Title: </Box>
                      {developer.contact.title}
                    </>
                  )}
                <br />
                <Box component="span" sx={utilStyles.srOnly}>Phone: </Box>
                {developer.contact.phoneNumber}
                <br />
                <Box component="span" sx={utilStyles.srOnly}>Email: </Box>
                {developer.contact.email}
              </Typography>
            )}
        </div>
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Self-developer</strong>
            <br />
            {developer.selfDeveloper ? 'Yes' : 'No'}
          </Typography>
          <br />
          {developer.address
            && (
              <Typography variant="body1" gutterBottom>
                <strong>Address</strong>
                <br />
                <Box component="span" sx={utilStyles.srOnly}>Line 1: </Box>
                {developer.address.line1}
                {developer.address.line2
                  && (
                    <>
                      ,
                      {' '}
                      <Box component="span" sx={utilStyles.srOnly}>Line 2: </Box>
                      {developer.address.line2}
                    </>
                  )}
                <br />
                <Box component="span" sx={utilStyles.srOnly}>City: </Box>
                {developer.address.city}
                ,
                {' '}
                <Box component="span" sx={utilStyles.srOnly}>State: </Box>
                {developer.address.state}
                {' '}
                <Box component="span" sx={utilStyles.srOnly}>Zipcode: </Box>
                {developer.address.zipcode}
                ,
                {' '}
                <Box component="span" sx={utilStyles.srOnly}>Country: </Box>
                {developer.address.country}
              </Typography>
            )}
        </div>
        <Box sx={styles.fullWidth}>
          {developer.website
            && (
              <Typography variant="body1" gutterBottom>
                <strong>Website</strong>
                <br />
                <ChplLink
                  href={developer.website}
                />
              </Typography>
            )}
        </Box>
        {developer.statuses?.length > 0 && getStatusData(developer.statuses)}
      </CardContent>
      { (can('edit') || can('split') || can('join'))
        && (
          <CardActions>
            <ButtonGroup
              color="primary"
            >
              { can('edit') && hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
               && (
                 <ChplTooltip title={`Edit ${developer.name} Information`}>
                   <Button
                     variant="contained"
                     aria-label={`Edit ${developer.name} Information`}
                     id="developer-component-edit"
                     onClick={edit}
                   >
                     <EditOutlinedIcon />
                   </Button>
                 </ChplTooltip>
               )}
              { can('edit') && hasAnyRole(['chpl-developer'])
               && (
               <Button
                 variant="contained"
                 aria-label={`Submit ${developer.name} Demographics Change`}
                 id="developer-component-edit"
                 onClick={createDemographicsCr}
               >
                 Submit Demographics Change
               </Button>
               )}
              { can('split')
               && (
                 <ChplTooltip title={`Split ${developer.name}`}>
                   <Button
                     variant="outlined"
                     aria-label={`Split ${developer.name}`}
                     id="developer-component-split"
                     onClick={split}
                   >
                     <CallSplitIcon />
                   </Button>
                 </ChplTooltip>
               )}
              { can('join')
               && (
                 <ChplTooltip title={`Join ${developer.name}`}>
                   <Button
                     variant="outlined"
                     aria-label={`Join ${developer.name}`}
                     id="developer-component-join"
                     onClick={join}
                   >
                     <CallMergeIcon />
                   </Button>
                 </ChplTooltip>
               )}
            </ButtonGroup>
          </CardActions>
        )}
    </Card>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  canEdit: func.isRequired,
  canJoin: func.isRequired,
  canSplit: func.isRequired,
  dispatch: func.isRequired,
  isSplitting: bool.isRequired,
};
