import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ReactGA from 'react-ga4';

import { ChplLink, ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { acb as acbPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  header: {
    margin: '0',
    fontSize: '1.25em',
  },
  subContentBox: {
    width: '48%',
  },
});

function ChplOncOrganizationView(props) {
  const {
    organization: initialOrg,
    dispatch,
  } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [organization, setOrganization] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    setOrganization(initialOrg);
  }, [initialOrg]);

  const edit = () => {
    if (hasAnyRole(['chpl-admin'])) {
      ReactGA.event({
        category: 'Organizations',
        action: 'Edit',
        label: `${organization.name} | chpl-admin`,
      });
    }
    if (hasAnyRole(['chpl-onc'])) {
      ReactGA.event({
        category: 'Organizations',
        action: 'Edit',
        label: `${organization.name} | chpl-onc`,
      });
    }
    if (hasAnyRole(['chpl-onc-acb'])) {
      ReactGA.event({
        category: 'Organizations',
        action: 'Edit',
        label: `${organization.name} | chpl-onc-acb`,
      });
    }
    dispatch('edit');
  };

  if (!organization) { return null; }

  return (
    <Card
      title={`${organization.name} Information`}
    >
      <CardHeader
        title={organization.name}
        component="h2"
        className={classes.header}
      />
      <CardContent className={classes.content}>
        { organization.website
         && (
         <Box className={classes.subContentBox}>
           <Typography variant="body1" gutterBottom>
             <strong>Website</strong>
             <br />
             <ChplLink
               href={organization.website}
             />
           </Typography>
         </Box>
         )}
        <Box className={classes.subContentBox}>
          <Typography variant="body1" gutterBottom>
            <strong>Organization code</strong>
          </Typography>
          <Typography>{ organization.acbCode ?? organization.atlCode }</Typography>
        </Box>
        <Box className={classes.subContentBox}>
          <Typography variant="body1" gutterBottom>
            <strong>Retired</strong>
          </Typography>
          { organization.retired ? 'Yes' : 'No' }
        </Box>
        { organization.retired
            && (
              <Box className={classes.subContentBox}>
                <>
                  <Typography variant="body1" gutterBottom><strong>Retirement Date</strong></Typography>
                  { getDisplayDateFormat(organization.retirementDay) }
                </>
              </Box>
            )}
        { organization.address
         && (
         <Box className={classes.subContentBox}>
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
         </Box>
         )}
      </CardContent>
      <CardActions>
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
    </Card>
  );
}

export default ChplOncOrganizationView;

ChplOncOrganizationView.propTypes = {
  organization: acbPropType.isRequired,
  dispatch: func.isRequired,
};
