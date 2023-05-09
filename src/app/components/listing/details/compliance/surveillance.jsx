import React from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { palette, utilStyles } from 'themes';
import { getDisplayDateFormat } from 'services/date-util';

import { ChplTooltip } from 'components/util';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
  root: {
    width: '100%',
    padding: '0 8px!important',
  },
  subCard: {
    backgroundColor: `${palette.white}`,
    borderBottom: '.5px solid #c2c6ca',
  },
  NestedAccordionLevelOne: {
    borderRadius: '4px',
    display: 'grid',
    borderColor: ' #c2c6ca',
    borderWidth: '.5px',
    borderStyle: 'solid',
    padding: '0px',
    backgroundColor: `${palette.white}`,
  },
  NestedAccordionLevelOneSummary: {
    backgroundColor: `${palette.secondary}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  NestedAccordionLevelTwoSummary: {
    backgroundColor: `${palette.white}!important`,
    borderRadius: '4px',
    borderBottom: '.5px solid #c2c6ca',
    width: '100%',
    padding: '0 8px!important',
  },
  '& span.MuiTypography-root.MuiCardHeader-title.MuiTypography-h6.MuiTypography-displayBlock': {
    fontWeight: '300',
  },
});
import {
  surveillance as surveillancePropType,
} from 'shared/prop-types';

function ChplSurveillance(props) {
  const { surveillance } = props;
  const classes = useStyles();

  return (
    <div>
      <Box display="flex" flexDirection={"column"}>
        {/*Surveillance*/}
        <Accordion className={classes.NestedAccordionLevelOne}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            className={classes.NestedAccordionLevelOneSummary}
            color="secondary"
          >
            <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Typography>
                Surveillance Activites
              </Typography>
              <Typography variant="body2">
                1 closed / 2 non conformities found
              </Typography>
            </Box>
          </AccordionSummary>
          <CardContent>
            <Typography gutterBottom>
              Surveillance information is displayed here if a surveillance activity has been opened by an ONC-ACB that affects this listing
            </Typography>
            <Accordion className={classes.NestedAccordionLevelOne}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.NestedAccordionLevelTwoSummary}
                color="secondary"
              > <Typography>
                  Closed Surveillance, Ended Feb 1, 2023: Closed Non-Conformity was found
                </Typography>
              </AccordionSummary>
              <CardContent>
                <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
                  <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Date Surveillance Began
                      </Typography>
                      <Typography>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                  </Box>
                  <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                      Date Surveillance Ended
                      </Typography>
                      <Typography>
                      {surveillance.endDay }
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                  </Box>
                  <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Surveillance Type
                      </Typography>
                      <Typography>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                  </Box>
                  <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                      Certification Criteria and Program Requirements Surveilled
                      </Typography>
                      <Typography>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                  </Box>
                  <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Surveillance Results
                      </Typography>
                      <Typography gutterBottom>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                  </Box>
                </Box>
                <Accordion className={classes.NestedAccordionLevelOne}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.NestedAccordionLevelTwoSummary}
                    color="secondary"
                  >
                    <Typography>
                      Details for Non-conformity related to 1789,287(c)(3): Clinical quality measures - Report (Cures Update)
                    </Typography>
                  </AccordionSummary>
                  <CardContent>
                    <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                            Date of Detemination of Non-Conformity 
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                            Corrective Action Plan Approval Date
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                            Date Corrective Action Began
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                            Date Corrective Action Plan Must Be Completed
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                          Date Corrective Action Plan Was Completed
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                            Non-Conformity Type
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                          Non-Conformity Status
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="48%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                        <Box display="flex" flexDirection="column" >
                          <Typography variant='subtitle2'>
                          Non-Conformity Summary
                          </Typography>
                          <Typography>
                            MM/DD/YYYY
                          </Typography>
                        </Box>
                        <Box>
                          <ChplTooltip
                            placement="top"
                            title="Placement text"
                          >
                            <InfoIcon color="primary"></InfoIcon>
                          </ChplTooltip>
                        </Box>
                      </Box>
                      <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Findings
                      </Typography>
                      <Typography gutterBottom>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                      </Box>
                      <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Developer Explanation
                      </Typography>
                      <Typography gutterBottom>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                      </Box>
                      <Box width="100%" gridGap="8px" alignItems="center" display="flex" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" >
                      <Typography variant='subtitle2'>
                        Resolution
                      </Typography>
                      <Typography gutterBottom>
                        MM/DD/YYYY
                      </Typography>
                    </Box>
                    <Box>
                      <ChplTooltip
                        placement="top"
                        title="Placement text"
                      >
                        <InfoIcon color="primary"></InfoIcon>
                      </ChplTooltip>
                    </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Accordion>
              </CardContent>
            </Accordion>
          </CardContent>
        </Accordion>
      </Box >
    </div >
  );
}

export default ChplSurveillance;

ChplSurveillance.propTypes = {
  surveillance: arrayOf(surveillancePropType).isRequired,
};
