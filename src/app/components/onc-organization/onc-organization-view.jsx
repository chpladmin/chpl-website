import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { func } from 'prop-types';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import ChplOrganizationActivity from 'components/activity/organization-activity';
import { compareOrganization } from 'components/activity/services/organizations.service';
import { ChplLink, ChplTooltip } from 'components/util';
import { getDisplayDateFormat } from 'services/date-util';
import { acb as acbPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const styles = {
  content: {
    display: 'flex',
    gap: '16px',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    margin: '0',
    fontSize: '1.25em',
  },
  subContentBox: {
    width: '48%',
  },
};

function ChplOncOrganizationView({
  organization,
  dispatch,
}) {
  const edit = () => {
    dispatch('edit');
  };

  if (!organization) { return null; }

  return (
    <Card
      title={`${organization.name} Information`}
    >
      <CardHeader
        title={(
          <Box sx={styles.headerContainer}>
            { organization.name }
            <ChplOrganizationActivity
              organization={organization}
              type={organization.acbCode ? 'acbs' : 'atls'}
              interpret={compareOrganization}
            />
          </Box>
        )}
        component="h2"
        sx={styles.header}
      />
      <CardContent sx={styles.content}>
        { organization.website
         && (
         <Box sx={styles.subContentBox}>
           <Typography variant="body1" gutterBottom>
             <strong>Website</strong>
             <br />
             <ChplLink
               href={organization.website}
             />
           </Typography>
         </Box>
         )}
        <Box sx={styles.subContentBox}>
          <Typography variant="body1" gutterBottom>
            <strong>Organization code</strong>
          </Typography>
          <Typography>{ organization.acbCode ?? organization.atlCode }</Typography>
        </Box>
        <Box sx={styles.subContentBox}>
          <Typography variant="body1" gutterBottom>
            <strong>Retired</strong>
          </Typography>
          { organization.retired ? 'Yes' : 'No' }
        </Box>
        { organization.retired
            && (
              <Box sx={styles.subContentBox}>
                <>
                  <Typography variant="body1" gutterBottom><strong>Retirement Date</strong></Typography>
                  { getDisplayDateFormat(organization.retirementDay) }
                </>
              </Box>
            )}
        { organization.address
         && (
         <Box sx={styles.subContentBox}>
           <Typography variant="body1" gutterBottom>
             <strong>Address</strong>
             <br />
             <Box component="span" sx={utilStyles.srOnly}>Line 1: </Box>
             {organization.address.line1}
             {organization.address.line2
              && (
                <>
                  ,
                  {' '}
                  <Box component="span" sx={utilStyles.srOnly}>Line 2: </Box>
                  {organization.address.line2}
                </>
              )}
             <br />
             <Box component="span" sx={utilStyles.srOnly}>City: </Box>
             {organization.address.city}
             ,
             {' '}
             <Box component="span" sx={utilStyles.srOnly}>State: </Box>
             {organization.address.state}
             {' '}
             <Box component="span" sx={utilStyles.srOnly}>Zipcode: </Box>
             {organization.address.zipcode}
             ,
             {' '}
             <Box component="span" sx={utilStyles.srOnly}>Country: </Box>
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
