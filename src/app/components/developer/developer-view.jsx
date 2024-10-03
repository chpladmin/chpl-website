import React, { useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@material-ui/lab';
import { bool, func } from 'prop-types';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ChplDeveloperActivity from 'components/activity/developer-activity';
import { ChplLink, ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { developer as developerPropType } from 'shared/prop-types';
import { FlagContext, UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  historyContent: {
    display: 'grid',
    padding: '4px',
  },
  developerHeader: {
    margin: '0',
    fontSize: '1.25em',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    margin: 0,
  },
  statusHistorySummary: {
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderRadius: '8px',
  },
  statusHistory: {
    boxShadow: 'none',
    borderRadius: '8px',
    border: '.5px solid #c2c6ca',
    fontWeight: 'bold',
    marginTop: '8px',
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  MuiAccordionroot: {
    '&.MuiAccordion-root:before': {
      backgroundColor: 'transparent',
    },
  },
});

const isActive = (statuses) => !statuses || statuses.length === 0 || statuses.every((status) => status.endDate);

const getStatusData = (statuses, classes) => {
  const current = statuses
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))[0];
  if (current.endDate) { return undefined; }
  const rest = statuses
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  return (
    <div className={classes.fullWidth}>
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
            className={classes.statusHistory}
            classes={{
              root: classes.MuiAccordionroot,
            }}
          >
            <AccordionSummary
              className={classes.statusHistorySummary}
              expandIcon={<ExpandMoreIcon color="primary" />}
            >
              Status History
            </AccordionSummary>
            <AccordionDetails
              className={classes.historyContent}
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
                             <i className="fa status-bad fa-exclamation-circle" />
                             {' '}
                           </>
                         )}
                        {status.status.name === 'Under certification ban by ONC'
                         && (
                           <>
                             <i className="fa status-bad fa-ban" />
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
    </div>
  );
};

function ChplDeveloperView(props) {
  const {
    canEdit,
    canJoin,
    canSplit,
    developer: initialDeveloper,
    dispatch,
    isSplitting,
  } = props;
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const [demographicChangeRequestIsOn, setDemographicChangeRequestIsOn] = useState(false);
  const [developer, setDeveloper] = useState({});
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(initialDeveloper);
  }, [initialDeveloper]);

  useEffect(() => {
    setDemographicChangeRequestIsOn(isOn('demographic-change-request'));
  }, [isOn]);

  const can = (action) => {
    if (action === 'edit') {
      return canEdit
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && isActive(developer.statuses)) // allowed for ACB iff Developer is "Active"
          || (hasAnyRole(['chpl-developer']) && isActive(developer.statuses) && demographicChangeRequestIsOn)); // allowed for DEVELOPER iff Developer is "Active" & CRs can be submitted
    }
    if (action === 'join') {
      return canJoin
        && hasAnyRole(['chpl-admin', 'chpl-onc']); // always allowed as ADMIN/ONC
    }
    if (action === 'split') {
      return canSplit
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && isActive(developer.statuses))); // allowed for ACB iff Developer is "Active"
    }
    return false;
  };

  const edit = () => {
    dispatch('edit');
  };

  const join = () => {
    dispatch('join');
  };

  const split = () => {
    dispatch('split');
  };

  return (
    <Card
      title={`${developer.name} Information`}
    >
      <CardHeader
        title={
          <div className={classes.headerContainer}>
              {isSplitting ? 'Original Developer' : developer.name}
            {can('edit') && (
              <ChplDeveloperActivity
                developer={developer}
                className={classes.activityButton}
              />
            )}
          </div>
        }
        component="div"
        className={classes.developerHeader}
      />
      <CardContent className={classes.content}>
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
                <span className="sr-only">Full name: </span>
                {developer.contact.fullName}
                {developer.contact.title
                  && (
                    <>
                      ,
                      {' '}
                      <span className="sr-only">Title: </span>
                      {developer.contact.title}
                    </>
                  )}
                <br />
                <span className="sr-only">Phone: </span>
                {developer.contact.phoneNumber}
                <br />
                <span className="sr-only">Email: </span>
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
                <span className="sr-only">Line 1: </span>
                {developer.address.line1}
                {developer.address.line2
                  && (
                    <>
                      ,
                      {' '}
                      <span className="sr-only">Line 2: </span>
                      {developer.address.line2}
                    </>
                  )}
                <br />
                <span className="sr-only">City: </span>
                {developer.address.city}
                ,
                {' '}
                <span className="sr-only">State: </span>
                {developer.address.state}
                {' '}
                <span className="sr-only">Zipcode: </span>
                {developer.address.zipcode}
                ,
                {' '}
                <span className="sr-only">Country: </span>
                {developer.address.country}
              </Typography>
            )}
        </div>
        <div className={classes.fullWidth}>
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
        </div>
        {developer.statuses?.length > 0 && getStatusData(developer.statuses, classes)}
      </CardContent>
      {(can('edit') || can('split') || can('join'))
        && (
          <CardActions className={classes.cardActions}>
            <ButtonGroup
              color="primary"
            >
              {can('edit')
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
              {can('split')
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
              {can('join')
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
  canEdit: bool.isRequired,
  canJoin: bool.isRequired,
  canSplit: bool.isRequired,
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  isSplitting: bool.isRequired,
};
