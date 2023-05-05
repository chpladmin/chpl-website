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
import { arrayOf } from 'prop-types';
import { palette, utilStyles } from 'themes';
import { ChplTooltip } from 'components/util';
import { measure as measureType } from 'shared/prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChplDirectReviews from './direct-reviews';
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


function ChplCompliance(props) {
  const { compliance } = props;
  const classes = useStyles();
  /*
    if (!compliance || compliance.length === 0) {
      return (
        <Typography>
          No data for Compliance Activites.
        </Typography>
      );
    }
  */
  return (
    <div>
      <Accordion className={classes.NestedAccordionLevelOne}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className={classes.NestedAccordionLevelOneSummary}
          color="secondary"
        >
          <Typography>
            Compliance Activites
          </Typography>
        </AccordionSummary>
        <Box display="flex" flexDirection={"column"}>
          <CardContent>
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
                    1 open / 2 non conformities found
                  </Typography>
                </Box>
              </AccordionSummary>
              <CardContent>
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
                            Developer Associated Listings
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
                            Corrective Action Plan Approval date
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
                            Corrective Action Plan Must Be Completed
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
                            Corrective Action Plan was completed
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
                            Developer Associated Listings
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
                            Corrective Action Plan Approval date
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
                            Corrective Action Plan Must Be Completed
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
                            Corrective Action Plan was completed
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
                    </Box>
                      </CardContent>
                    </Accordion>
                  </CardContent>
                </Accordion>
              </CardContent>
            </Accordion>
            {/*Direct Reviews*/}
            <ChplDirectReviews></ChplDirectReviews>
          </CardContent>
        </Box >
      </Accordion >
    </div >
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  measures: arrayOf(measureType).isRequired,
};
