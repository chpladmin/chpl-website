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
import { func } from 'prop-types';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CallMergeIcon from '@material-ui/icons/CallMerge';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { ChplLink, ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { acb as acbPropType } from 'shared/prop-types';
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

function ChplOncOrganizationView(props) {
  const {
    organization,
    dispatch,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();

  const can = (action) => {
    if (action === 'edit') {
      return (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']) // always allowed as ADMIN/ONC
          || (hasAnyRole(['ROLE_ACB']) && developer.status.status === 'Active')); // allowed for ACB iff OncOrganization is "Active"
    }
    return false;
  };

  const edit = () => {
    props.dispatch('edit');
  };

  return (
    <Card
      title={`${organization.name} Information`}
    >
      <CardHeader
        title={organization.name}
        component="h2"
        className={classes.developerHeader}
      />
      <CardContent className={classes.content}>
        <Typography variant="body1" gutterBottom>
          <strong>ONC-ACB code</strong>
          {organization.acbCode}
        </Typography>
        {organization.address
         && (
           <Typography variant="body1" gutterBottom>
             <strong>Address</strong>
             <br />
             <span className="sr-only">Line 1: </span>
             {organization.address.line1}
             {organization.address.line2
              && (
                <>
                  ,
                  {' '}
                  <span className="sr-only">Line 2: </span>
                  {organization.address.line2}
                </>
              )}
             <br />
             <span className="sr-only">City: </span>
             {organization.address.city}
             ,
             {' '}
             <span className="sr-only">State: </span>
             {organization.address.state}
             {' '}
             <span className="sr-only">Zipcode: </span>
             {organization.address.zipcode}
             ,
             {' '}
             <span className="sr-only">Country: </span>
             {organization.address.country}
           </Typography>
         )}

      {organization.website
       && (
         <Typography variant="body1" gutterBottom>
           <strong>Website</strong>
           <br />
           <ChplLink
             href={organization.website}
           />
         </Typography>
       )}
    </CardContent>
    {(can('edit'))
     && (
       <CardActions className={classes.cardActions}>
         <ButtonGroup
           color="primary"
         >
           <ChplTooltip title={`Edit ${organization.name} Information`}>
             <Button
               variant="contained"
               aria-label={`Edit ${organization.name} Information`}
               id="organization-component-edit"
               onClick={edit}
             >
               <EditOutlinedIcon />
             </Button>
           </ChplTooltip>
         </ButtonGroup>
       </CardActions>
     )}
    </Card>
  );
}

export default ChplOncOrganizationView;

ChplOncOrganizationView.propTypes = {
  organization: acbPropType.isRequired,
  dispatch: func.isRequired,
};
