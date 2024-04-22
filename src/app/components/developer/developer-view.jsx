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

import { ChplLink, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
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

const getStatusData = (statusEvents, DateUtil, classes) => {
  const current = statusEvents
    .sort((a, b) => b.statusDate - a.statusDate)[0];
  if (current.status.id === 1) { return; }
  const rest = statusEvents
    .sort((a, b) => b.statusDate - a.statusDate).slice(1);
  return (
    <div className={classes.fullWidth}>
      <Typography variant="body1" gutterBottom>
        <strong>Status</strong>
        <br />
        {current.status.status}
        {' '}
        as of
        {' '}
        {DateUtil.getDisplayDateFormat(current.statusDate)}
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
              {rest.map((status) => (
                <Timeline
                  key={status.id}
                >
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography
                        variant="body1"
                      >
                        <strong>Status</strong>
                        <br />
                        {status.status.status === 'Suspended by ONC'
                          && (
                            <>
                              <i className="fa status-bad fa-exclamation-circle" />
                              {' '}
                            </>
                          )}
                        {status.status.status === 'Under certification ban by ONC'
                          && (
                            <>
                              <i className="fa status-bad fa-ban" />
                              {' '}
                            </>
                          )}
                        {status.status.status}
                        {' '}
                        as of
                        {' '}
                        {DateUtil.getDisplayDateFormat(status.statusDate)}
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
  const DateUtil = getAngularService('DateUtil');
  const {
    canEdit,
    canJoin,
    canSplit,
    isSplitting,
  } = props;
  const [developer, setDeveloper] = useState({});
  const { demographicChangeRequestIsOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const can = (action) => {
    if (action === 'edit') {
      return canEdit
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && developer.status.status === 'Active') // allowed for ACB iff Developer is "Active"
          || (hasAnyRole(['chpl-developer']) && developer.status.status === 'Active' && demographicChangeRequestIsOn)); // allowed for DEVELOPER iff Developer is "Active" & CRs can be submitted
    }
    if (action === 'join') {
      return canJoin
        && hasAnyRole(['chpl-admin', 'chpl-onc']); // always allowed as ADMIN/ONC
    }
    if (action === 'split') {
      return canSplit
        && (hasAnyRole(['chpl-admin', 'chpl-onc']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['chpl-onc-acb']) && developer.status.status === 'Active')); // allowed for ACB iff Developer is "Active"
    }
    return false;
  };

  const edit = () => {
    props.dispatch('edit');
  };

  const join = () => {
    props.dispatch('join');
  };

  const split = () => {
    props.dispatch('split');
  };

  return (
    <Card
      title={`${developer.name} Information`}
    >
      <CardHeader
        title={isSplitting ? 'Original Developer' : developer.name}
        component="h2"
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
        {developer?.statusEvents?.length > 0 && getStatusData(developer.statusEvents, DateUtil, classes)}
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
