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
import { bool, func } from 'prop-types';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CallMergeIcon from '@material-ui/icons/CallMerge';

import { ChplLink, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { developer as developerPropType } from 'shared/prop-types';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  historyContent: {
    display: 'grid',
    gap: '8px',
  },
});

const getStatusData = (statusEvents, DateUtil, classes) => {
  const current = statusEvents
    .sort((a, b) => b.statusDate - a.statusDate)[0];
  const rest = statusEvents
    .sort((a, b) => b.statusDate - a.statusDate).slice(1);
  return (
    <>
      <Typography variant="body1" gutterBottom>
        <strong>Status</strong>
        <br />
        {current.status.status}
        {' '}
        as of
        {' '}
        { DateUtil.getDisplayDateFormat(current.statusDate) }
        { current.reason
          && (
            <>
              <br />
              {current.reason}
            </>
          )}
      </Typography>
      {rest.length > 0
       && (
         <Accordion>
           <AccordionSummary>
             Status History
           </AccordionSummary>
           <AccordionDetails
             className={classes.historyContent}
           >
             { rest.map((status) => (
               <Typography
                 variant="body1"
                 key={status.id}
               >
                 <strong>Status</strong>
                 <br />
                 { status.status.status === 'Suspended by ONC'
                   && (
                     <>
                       <i className="fa status-bad fa-exclamation-circle" />
                     </>
                   )}
                 { status.status.status === 'Under certification ban by ONC'
                   && (
                     <>
                       <i className="fa status-bad fa-ban" />
                     </>
                   )}
                 {status.status.status}
                 {' '}
                 as of
                 { DateUtil.getDisplayDateFormat(status.statusDate) }
                 { status.reason
                   && (
                     <>
                       <br />
                       {status.reason}
                     </>
                   )}
               </Typography>
             ))}
           </AccordionDetails>
         </Accordion>
       )}
    </>
  );
};

function ChplDeveloperView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { isSplitting } = props;
  const [developer, setDeveloper] = useState({});
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const can = (action) => {
    // todo - containing allowances?
    // todo - add Developer can edit (flag & owns organization based)
    if (action === 'edit') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
        || (hasAnyRole(['ROLE_ACB']) && developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"
    }
    if (action === 'merge') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']); // always allowed as ADMIN/ONC
    }
    if (action === 'split') {
      return hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
        || (hasAnyRole(['ROLE_ACB']) && developer.status.status === 'Active'); // allowed for ACB iff Developer is "Active"
    }
    return false;
  };

  const edit = () => {
    props.dispatch('edit');
  };

  const split = () => {
    props.dispatch('split');
  };

  const merge = () => {
    props.dispatch('merge');
  };

  return (
    <Card
      title={`${developer.name} Information`}
    >
      <CardHeader
        title={isSplitting ? 'Original Developer' : developer.name}
      />
      <CardContent className={classes.content}>
        <div>
          <Typography variant="body1" gutterBottom>
            <strong>Developer code</strong>
            <br />
            {developer.developerCode}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Self-developer</strong>
            <br />
            {developer.selfDeveloper ? 'Yes' : 'No'}
          </Typography>
          { developer?.statusEvents?.length > 0 && getStatusData(developer.statusEvents, DateUtil, classes) }
        </div>
        <div>
          { developer.contact
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
          { developer.address
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
          { developer.website
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
      </CardContent>
      { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']) && !isSplitting
          && (
            <CardActions className={classes.cardActions}>
              <ButtonGroup
                color="primary"
              >
                { can('edit')
                  && (
                    <ChplTooltip title={`Edit ${developer.name} Information`}>
                      <Button
                        variant="contained"
                        aria-label={`Edit ${developer.name} Information`}
                        onClick={edit}
                      >
                        <EditOutlinedIcon />
                      </Button>
                    </ChplTooltip>
                  )}
                { can('split')
                  && (
                  <ChplTooltip title={`Split ${developer.name}`}>
                    <Button
                      variant="outlined"
                      aria-label={`Split ${developer.name}`}
                      onClick={split}
                    >
                      <CallSplitIcon />
                    </Button>
                  </ChplTooltip>
                  )}
                { can('merge')
                  && (
                  <ChplTooltip title={`Merge ${developer.name}`}>
                    <Button
                      variant="outlined"
                      aria-label={`Merge ${developer.name}`}
                      onClick={merge}
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
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  isSplitting: bool.isRequired,
};
